import { Dialog, Icon, Button } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Text,
  Modal,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import 'react-native-get-random-values';
import {
  Bubble,
  GiftedChat,
  IMessage,
  MessageImage,
  Send,
} from 'react-native-gifted-chat';
import type { BubbleProps } from 'react-native-gifted-chat/lib/Bubble/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@theme';
import { ChatStyles } from './ChatStyles';

import { CameraScreen } from '@components';
import { useAuth, useSubscription } from '@hooks';
import {
  ensurePushTokenSynced,
  fetchMessagePage,
  getInitialWelcomeMessage,
  markWelcomeDeliveredOnServer,
  prepareForUpload,
  sendChatImage,
  sendChatMessage,
} from '@services';
import { useFocusEffect } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { URLS } from '@constants';

// const storeLastOpenedDate = async () => {
//   const today = format(new Date(), 'yyyy-MM-dd');
//   await SecureStore.setItemAsync('lastChatOpenedDate', today);
// };

const IOS_SETTINGS = URLS.iosSettings;

const welcomeKeyFor = (userId: string) => `welcomeDelivered${userId}`;

const hasDeliveredWelcomeLocal = async (userId: string) => {
  try {
    const v = await SecureStore.getItemAsync(welcomeKeyFor(userId));
    console.log(v);
    return v === '1';
  } catch {
    return false;
  }
};

const markWelcomeDeliveredLocal = async (userId: string) => {
  try {
    await SecureStore.setItemAsync(welcomeKeyFor(userId), '1');
  } catch (error) {
    console.log('error marking welcome delivered local', error);
  }
};

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const loadingPage = useRef(false);
  const activeUserId = useRef<string | undefined>(undefined);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [failedPhotos, setFailedPhotos] = useState<
    Record<string, { uri: string; caption: string; userId: string }>
  >({});
  const [permission, requestPermission] = useCameraPermissions();
  const [showDialogSettings, setShowDialogSettings] = useState(false);

  const headerHeight = useHeaderHeight();
  const styles = ChatStyles();

  const { user } = useAuth();
  const { connected, checkSubscription } = useSubscription();

  // cuando hace foco sobre el chatscreen chequeo si esta ok la subscripcion
  useFocusEffect(
    useCallback(() => {
      console.log('[ChatScreen] subs check init');
      if (!user?._id) return; // guard if user not ready

      const check = async () => {
        try {
          await checkSubscription(true);
        } catch (e) {
          console.log('Error trying to check subscription', e);
        }
      };
      check();
    }, [user?._id, connected])
  );

  useEffect(() => {
    let active = true;
    activeUserId.current = user?._id;
    setNextCursor(null);
    setMessages([]);
    setFailedPhotos({});
    console.log('corre use Effect de initialize Chat');
    const initializeChat = async () => {
      if (user && user._id) {
        // chequeo si el token para notificaciones esta guardado, si no lo guardo
        // si no, pido permiso para notificaciones y luego guardo el token
        await ensurePushTokenSynced(user._id, { requestIfDenied: true });
        console.log(user._id);
        const page = await fetchMessagePage(user._id).catch(() => null);
        if (!active) return;
        const prevMessages = page?.messages ?? null;
        setNextCursor(page?.nextCursor ?? null);
        // console.log(prevMessages);
        if (prevMessages === null) {
          Alert.alert('Error', 'Could not load previous messages');
        } else {
          setMessages(prevMessages!);

          // Only consider sending welcome if this really looks like the first time
          const looksLikeNewUser = prevMessages?.length < 1;

          // optional: also trust server flag if present
          // const serverDelivered = !!user.deliveredWelcome;

          // Also check a per-user local flag so we never double-send
          const alreadyDeliveredLocal = await hasDeliveredWelcomeLocal(
            user._id
          );

          if (
            looksLikeNewUser &&
            !(alreadyDeliveredLocal === true)
            // !(serverDelivered === true)
          ) {
            // if (true) {
            try {
              setIsTyping(true);

              const welcomeMessage = await getInitialWelcomeMessage(user._id);

              // Append it to the chat
              setMessages(prev => GiftedChat.append(prev, welcomeMessage));

              // Persist welcome delivery both locally and on server
              await Promise.all([
                markWelcomeDeliveredLocal(user._id),
                markWelcomeDeliveredOnServer(user._id),
              ]);
            } catch (e) {
              console.log('Failed to deliver welcome message', e);
            } finally {
              setIsTyping(false);
            }
          }
        }
      }
    };

    void initializeChat();
    return () => {
      active = false;
      activeUserId.current = undefined;
    };
  }, [user?._id]);

  const loadEarlier = async () => {
    if (!user?._id || !nextCursor || loadingPage.current) return;
    const userId = user._id;
    loadingPage.current = true;
    setLoadingEarlier(true);
    try {
      const page = await fetchMessagePage(userId, nextCursor);
      if (activeUserId.current !== userId) return;
      setMessages(current => {
        const seen = new Set(current.map(message => message._id));
        return [
          ...current,
          ...page.messages.filter(message => !seen.has(message._id)),
        ];
      });
      setNextCursor(page.nextCursor);
    } catch {
      if (activeUserId.current === userId)
        Alert.alert('Could not load earlier messages', 'Please try again.');
    } finally {
      loadingPage.current = false;
      setLoadingEarlier(false);
    }
  };

  const sendMes = async (message: IMessage[]) => {
    if (user && user._id) {
      try {
        // Append the user's message first
        setMessages(prevMessages => GiftedChat.append(prevMessages, message));
        const userMes = message[0].text;
        const userId = user._id;
        setIsTyping(true);
        const apiResponseMessage = await sendChatMessage(userMes, userId);
        if (!apiResponseMessage) throw new Error();
        setIsTyping(false);
        // Append the API's response message
        setMessages(prevMessages => {
          return GiftedChat.append(prevMessages, [apiResponseMessage]);
        });
      } catch (error) {
        console.log(error);
        const message = (
          error as {
            response?: { status?: number; data?: { message?: string } };
          }
        ).response;
        Alert.alert(
          'Error',
          message?.status === 413
            ? (message.data?.message ?? 'Please send a shorter message.')
            : 'Coach seems to have problems responding'
        );
        setIsTyping(false);
      }
    }
  };

  const openCamera = async () => {
    console.log('camera button pressed');
    console.log('camera permission', permission);
    if (!permission?.granted) {
      if (permission?.canAskAgain) {
        console.log('asking permission for camera');
        await requestPermission();
      } else {
        console.log('permission not granted and cant ask again');
        setShowDialogSettings(true);
      }
    } else {
      setCameraVisible(true);
    }
  };

  const sendPhotoRequest = async (
    imageUri: string,
    caption: string,
    requestId: string,
    userId: string
  ) => {
    setFailedPhotos(previous => {
      const updated = { ...previous };
      delete updated[requestId];
      return updated;
    });
    setIsTyping(true);
    try {
      const processedUri = await prepareForUpload(imageUri);
      const aiResponseMessage = await sendChatImage(
        processedUri,
        userId,
        caption.trim(),
        requestId
      );
      if (activeUserId.current !== userId) return;
      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [aiResponseMessage])
      );
    } catch (error) {
      console.log(error);
      if (activeUserId.current !== userId) return;
      setFailedPhotos(previous => ({
        ...previous,
        [requestId]: { uri: imageUri, caption, userId },
      }));
      const response = (
        error as { response?: { status?: number; data?: { message?: string } } }
      ).response;
      Alert.alert(
        'Could not send photo',
        response?.status === 413
          ? (response.data?.message ?? 'Please shorten your note.')
          : 'Tap Retry on the photo to try again.'
      );
    } finally {
      if (activeUserId.current === userId) setIsTyping(false);
    }
  };

  const handlePictureTaken = (
    imageUri: string,
    caption: string,
    requestId: string
  ) => {
    if (!user?._id) return;
    const createdAt = new Date();
    const messageUser = { _id: 1, name: user.name || 'User' };
    const imageMessage: IMessage = {
      _id: requestId,
      createdAt,
      text: '',
      user: messageUser,
      image: imageUri,
    };
    const note = caption.trim();
    const outgoing: IMessage[] = note
      ? [
          {
            _id: `${requestId}-caption`,
            createdAt,
            text: note,
            user: messageUser,
          },
          imageMessage,
        ]
      : [imageMessage];
    setMessages(previous => GiftedChat.append(previous, outgoing));
    setCameraVisible(false);
    void sendPhotoRequest(imageUri, note, requestId, user._id);
  };

  const renderBubble = (props: BubbleProps<IMessage>) => {
    const message = props.currentMessage;
    if (!message?.image) return <Bubble {...props} />;
    const failed = failedPhotos[String(message._id)];
    return (
      <View style={styles.photoMessage}>
        <MessageImage currentMessage={message} imageStyle={styles.chatPhoto} />
        <Text style={styles.photoTime}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
        {failed && (
          <TouchableOpacity
            style={styles.photoRetry}
            onPress={() =>
              void sendPhotoRequest(
                failed.uri,
                failed.caption,
                String(message._id),
                failed.userId
              )
            }>
            <Text style={styles.photoRetryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderActions = () => {
    return (
      <View style={styles.actionWrapper}>
        <TouchableOpacity onPress={openCamera}>
          <Icon
            name="camera"
            type="feather"
            color={COLORS.text}
            containerStyle={styles.iconsCamera}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendButtonWrapper}>
        <Icon
          name="send"
          type="feather"
          color={COLORS.text}
          size={22}
          containerStyle={styles.iconsSend}
        />
      </Send>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <GiftedChat
        renderAvatar={null}
        isTyping={isTyping}
        loadEarlierMessagesProps={{
          isAvailable: !!nextCursor,
          isLoading: loadingEarlier,
          onPress: loadEarlier,
        }}
        messages={messages}
        onSend={sendMes}
        user={{
          _id: 1,
          name: user?.name || 'User',
        }}
        renderActions={renderActions}
        renderSend={renderSend}
        renderBubble={renderBubble}
        isSendButtonAlwaysVisible={true}
        keyboardAvoidingViewProps={{
          // Gifted Chat's keyboard container starts below the Drawer header.
          keyboardVerticalOffset: headerHeight,
        }}
      />

      <Modal visible={cameraVisible} animationType="slide">
        {cameraVisible && (
          <CameraScreen
            onPictureTaken={handlePictureTaken}
            onClose={() => setCameraVisible(false)}
            onBarcodeLogged={(answer, description) => {
              const outgoing: IMessage = {
                _id: `barcode-${Date.now()}`,
                createdAt: new Date(),
                text: description,
                user: { _id: 1, name: user?.name || 'User' },
              };
              setMessages(previous =>
                GiftedChat.append(previous, [answer, outgoing])
              );
              setCameraVisible(false);
            }}
          />
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <Dialog
        isVisible={showDialogSettings}
        onBackdropPress={() => setShowDialogSettings(false)}>
        <Dialog.Title title="Camera" />
        <Text>
          To take meal photos, enable Camera access for Food Coach in Settings.
        </Text>

        <Dialog.Actions>
          <Button
            title="Open settings"
            onPress={async () => {
              setShowDialogSettings(false);
              console.log('running after interacion');
              await Linking.openURL(IOS_SETTINGS);
            }}
            titleStyle={styles.showSettingsText}
            type="clear"
            testID="confirm-delete"
          />
          <Button
            title="Cancel"
            type="clear"
            titleStyle={styles.cancelSettingsText}
            onPress={() => setShowDialogSettings(false)}
            testID="cancel-delete"
          />
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
};
