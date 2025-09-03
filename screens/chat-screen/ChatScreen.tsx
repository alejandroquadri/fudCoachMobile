import { Icon } from '@rneui/themed';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useState } from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@theme';
import { ChatStyles } from './ChatStyles';

import { CameraScreen } from '@components';
import { AuthContext, AuthContextType, useKeyboard } from '@hooks';
import {
  ensurePushTokenSynced,
  fetchPreviousMessages,
  sendChatImage,
  sendChatMessage,
  initUserPreferences,
  prepareForUpload,
  createInitialNotificatinJobs,
} from '@services';

const storeLastOpenedDate = async () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  await SecureStore.setItemAsync('lastChatOpenedDate', today);
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
  const { user } = auth;

  useEffect(() => {
    const checkAndShowGreeting = async (userId: string, newUser: boolean) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastOpenedDate = (await SecureStore.getItemAsync(
        'lastChatOpenedDate'
      )) as string;

      if (lastOpenedDate !== today || newUser) {
        try {
          setIsTyping(true);
          const mes = newUser ? 'New patient' : 'Greet the human';
          console.log(mes);
          const aiGreetings = await sendChatMessage(mes, userId);
          setIsTyping(false);
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [aiGreetings])
          );
          await storeLastOpenedDate();
        } catch (error) {
          console.log(error);
          Alert.alert('Error', 'Coach seems to have problems responding');
          setIsTyping(false);
        }
      }
    };

    const initializeChat = async () => {
      if (user && user._id) {
        const prevMessages = await fetchPreviousMessages(user._id);
        setMessages(prevMessages);
        const newUser = prevMessages.length < 1;
        console.log('es new user', newUser);

        await initUserPreferences(user);
        console.log('ai state actualizado');

        // // esto lo dejo comentado porque el init tiene que darse cuando
        // // se crea la cuenta solamente.
        // await createInitialNotificatinJobs(user._id);
        // console.log('terminado init not jobs');

        // chequeo si el token para notificaciones esta guardado, si no lo guardo
        // si no, pido permiso para notificaciones y luego guardo el token
        await ensurePushTokenSynced(user._id, { requestIfDenied: true });

        // NOTE: Lo saque temporariamente para que no haga constantes llamados al AI
        // await checkAndShowGreeting(user._id, newUser);
      }
    };

    initializeChat();
  }, [user]);

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
            color={COLORS.fontGrey}
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
          color={COLORS.fontGrey}
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
