import { useState, useEffect, useContext } from 'react';
import { Alert, View, TouchableOpacity, ViewStyle, Modal } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';

import { Icon } from '@rneui/themed';

import { COLORS, ChatStyles } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import {
  fetchPreviousMessages,
  sendChatImage,
  sendChatMessage,
} from '../services';
import { useKeyboard } from '../hooks';
import { CameraScreen } from '../components';

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
        console.log(newUser);
        // FIX: Lo saque temporariamente para que no haga constantes llamados al AI
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
        const apiResponseMessage = await sendChatMessage(userMes, userId);
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
    if (user && user._id) {
      const userId = user._id;
      console.log(user);
      const imageMessage: IMessage = {
        _id: new Date().getTime(),
        createdAt: new Date(),
        text: '',
        user: {
          _id: 1,
          name: user?.name || 'User',
        },
        image: imageUri,
      };

      setMessages(prevMessages =>
        GiftedChat.append(prevMessages, [imageMessage])
      );
      console.log('got image!', imageUri);
      setCameraVisible(false);
      try {
        setIsTyping(true);
        const aiResponseMessage = await sendChatImage(imageUri, userId);
        setIsTyping(false);
        setMessages(prevMessages =>
          GiftedChat.append(prevMessages, [aiResponseMessage])
        );
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Coach could not process the image');
        setIsTyping(false);
      }
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
