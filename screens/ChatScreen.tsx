import { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import { ChatStyles } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { fetchPreviousMessages, sendChatMessage } from '../services';
import { useKeyboard } from '../hooks';

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const isKeyboardVisible = useKeyboard();
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const insets = useSafeAreaInsets();
  const styles = ChatStyles(isKeyboardVisible, insets.bottom);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
  const { user } = auth;

  useEffect(() => {
    const initializeChat = async () => {
      if (user && user._id) {
        const prevMessages = await fetchPreviousMessages(user._id);
        setMessages(prevMessages);
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

      const apiResponseMessage = await sendChatMessage(userMes, userId);

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
        // isTyping={true}
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
