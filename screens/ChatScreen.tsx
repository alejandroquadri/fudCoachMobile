import { useState, useEffect, useContext } from 'react';
import { Alert, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';

import { ChatStyles } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { fetchPreviousMessages, sendChatMessage } from '../services';
import { useKeyboard } from '../hooks';

const storeLastOpenedDate = async () => {
  const today = format(new Date(), 'yyyy-MM-dd');
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
    const checkAndShowGreeting = async (userId: string, newUser: boolean) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastOpenedDate = (await SecureStore.getItemAsync(
        'lastChatOpenedDate'
      )) as string;

      if (lastOpenedDate !== today) {
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
        await checkAndShowGreeting(user._id, newUser);
      }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
