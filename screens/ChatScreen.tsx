import { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import * as SecureStore from 'expo-secure-store';

import { ChatStyles } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { fetchPreviousMessages, sendChatMessage } from '../services';
import { useKeyboard } from '../hooks';

const storeLastOpenedDate = async () => {
  const today = new Date().toISOString().split('T')[0];
  // const today = '2022-12-06';
  await SecureStore.setItemAsync('lastChatOpenedDate', today);
};

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const isKeyboardVisible = useKeyboard();
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const insets = useSafeAreaInsets();
  const styles = ChatStyles(isKeyboardVisible, insets.bottom);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
  const { user } = auth;

  useEffect(() => {
    const checkAndShowGreeting = async (userId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const lastOpenedDate =
        await SecureStore.getItemAsync('lastChatOpenedDate');
      console.log(lastOpenedDate, today);

      if (lastOpenedDate !== today) {
        setIsTyping(true);
        const aiGreetings = await sendChatMessage('Greet the human', userId);
        setIsTyping(false);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [aiGreetings])
        );

        await storeLastOpenedDate();
      }
    };

    const initializeChat = async () => {
      if (user && user._id) {
        const prevMessages = await fetchPreviousMessages(user._id);
        setMessages(prevMessages);
        await checkAndShowGreeting(user._id);
      }
    };

    initializeChat();
  }, [user]);

  const sendMes = async (message: IMessage[]) => {
    if (user && user._id) {
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
    }
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
      />
    </View>
  );
};
