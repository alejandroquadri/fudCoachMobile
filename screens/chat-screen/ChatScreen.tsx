import { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@theme';
import { ChatStyles } from './ChatStyles';

import { CameraScreen } from '@components';
import {
  AuthContext,
  AuthContextType,
  useAuth,
  useCurrentUser,
  useKeyboard,
} from '@hooks';
import {
  ensurePushTokenSynced,
  fetchPreviousMessages,
  sendChatImage,
  sendChatMessage,
  initUserPreferences,
  prepareForUpload,
  getInitialWelcomeMessage,
  markWelcomeDeliveredOnServer,
  getProfile,
  // createInitialNotificatinJobs,
} from '@services';
import { useFocusEffect } from '@react-navigation/native';

const storeLastOpenedDate = async () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  await SecureStore.setItemAsync('lastChatOpenedDate', today);
};

const welcomeKeyFor = (userId: string) => `welcomeDelivered${userId}`;

const hasDeliveredWelcome = async (userId: string) => {
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
    console.log(
      'trato de marcat delivered local',
      userId,
      welcomeKeyFor(userId)
    );
    await SecureStore.setItemAsync(welcomeKeyFor(userId), '1');
    console.log('marcado delivered local');
  } catch (error) {
    console.log('error marking welcome delivered local', error);
  }
};

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const isKeyboardVisible = useKeyboard();
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const insets = useSafeAreaInsets();
  const styles = ChatStyles(isKeyboardVisible, insets.bottom);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
  const user = useCurrentUser();
  const { refreshUser } = useAuth();

  // ⬇️ Refetch profile each time Chat screen gets focus
  useFocusEffect(
    useCallback(() => {
      console.log('corre use Focus Effect');
      let canceled = false;

      (async () => {
        try {
          if (!user?._id) return;
          const fresh = await getProfile(user._id);
          if (canceled) return;
          console.log('nuevo user', fresh);
          if (fresh?.updatedAt !== user?.updatedAt) {
            refreshUser(fresh);
          }
        } catch (e) {
          console.log('Failed to refresh profile on Chat focus', e);
          // you can show a toast/Alert if you want, but keeping it quiet is fine here
        }
      })();

      return () => {
        canceled = true;
      };
    }, [])
  );

  useEffect(() => {
    console.log('corre use Effect de initialize Chat');
    const initializeChat = async () => {
      if (user && user._id) {
        console.log(user);
        const prevMessages = await fetchPreviousMessages(user._id);
        console.log('traigo mensages previos', prevMessages);
        if (prevMessages === null) {
          Alert.alert('Error', 'Could not load previous messages');
        }
        setMessages(prevMessages!);

        await initUserPreferences(user);
        console.log('ai state actualizado');

        // chequeo si el token para notificaciones esta guardado, si no lo guardo
        // si no, pido permiso para notificaciones y luego guardo el token
        await ensurePushTokenSynced(user._id, { requestIfDenied: true });

        // Only consider sending welcome if this really looks like the first time
        const looksLikeNewUser = prevMessages!.length < 1;

        // optional: also trust server flag if present
        const serverDelivered = !!user.deliveredWelcome;

        // Also check a per-user local flag so we never double-send
        const alreadyDelivered = await hasDeliveredWelcome(user._id);

        if (
          looksLikeNewUser &&
          !(alreadyDelivered === true) &&
          !(serverDelivered === true)
        ) {
          // if (!alreadyDelivered) {
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

            console.log('vuelven las promises');
          } catch (e) {
            console.log('Failed to deliver welcome message', e);
          } finally {
            setIsTyping(false);
          }
        }
      }
    };

    initializeChat();
  }, [user?._id]);

  const sendMes = async (message: IMessage[]) => {
    if (user && user._id) {
      try {
        // Append the user's message first
        setMessages(prevMessages => GiftedChat.append(prevMessages, message));
        const userMes = message[0].text;
        const userId = user._id;
        setIsTyping(true);
        const apiResponseMessage = await sendChatMessage(userMes, userId).catch(
          error => console.log('error enviando mensage a ai', error)
        );
        setIsTyping(false);
        // Append the API's response message
        setMessages(prevMessages => {
          return GiftedChat.append(prevMessages, [apiResponseMessage]);
        });
        // auth.updateUser(user);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Coach seems to have problems responding');
        setIsTyping(false);
      }
    }
  };

  const handlePictureTaken = async (imageUri: string) => {
    if (!user?._id) {
      return;
    }
    const userId = user._id;
    console.log(user);
    const processedUri = await prepareForUpload(imageUri); // <-- new
    const imageMessage: IMessage = {
      _id: new Date().getTime(),
      createdAt: new Date(),
      text: '',
      user: {
        _id: 1,
        name: user?.name || 'User',
      },
      image: processedUri,
    };

    setMessages(prevMessages =>
      GiftedChat.append(prevMessages, [imageMessage])
    );
    console.log('got image!', imageUri);
    setCameraVisible(false);
    try {
      setIsTyping(true);
      const aiResponseMessage = await sendChatImage(processedUri, userId);
      setIsTyping(false);
      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [aiResponseMessage])
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Coach could not process the image');
      setIsTyping(false);
    }
  };

  const renderActions = () => {
    return (
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          onPress={() => {
            setCameraVisible(true);
            console.log('camera button pressed');
          }}>
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
    <View style={styles.container}>
      <GiftedChat
        showUserAvatar={true}
        isTyping={isTyping}
        messages={messages}
        onSend={sendMes}
        user={{
          _id: 1,
          name: user?.name || 'User',
        }}
        renderActions={renderActions}
        renderSend={renderSend}
        alwaysShowSend={true}
      />

      <Modal visible={cameraVisible} animationType="slide">
        <CameraScreen
          onPictureTaken={handlePictureTaken}
          onClose={() => setCameraVisible(false)}
        />
      </Modal>
    </View>
  );
};
