import { useState, useEffect } from 'react';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { GiftedChat, IMessage, Composer, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '../theme';
import { aiApi } from '../api';

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // const sendMes = async (message: IMessage[]) => {
  //   setMessages(GiftedChat.append(messages, message));

  //   const call = await aiApi.test();
  //   console.log(call.data);
  //   // append message with was returned from the api
  // };

  const sendMes = async (message: IMessage[]) => {
    // Append the user's message first
    setMessages(prevMessages => GiftedChat.append(prevMessages, message));

    const call = await aiApi.test();
    // const uuid = await uuidv4();
    // console.log(uuid);

    // Assuming call.data contains a string message from the API
    const apiResponseMessage: IMessage = {
      _id: uuidv4(), // uuid, // Generate a random ID or use another method
      text: call.data, // Assuming call.data is the message string
      createdAt: new Date(),
      user: {
        _id: 2, // Different ID to differentiate from the user
        name: 'Food Coach', // You can name it whatever you want
      },
    };

    // Append the API's response message
    setMessages(prevMessages => {
      return GiftedChat.append(prevMessages, [apiResponseMessage]);
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.white,
      flex: 1,
      paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
    },
    sendText: { color: '#007AFF', fontSize: 16 },
    sendView: { marginBottom: 5, marginRight: 10 },
    textInputStyle: {
      backgroundColor: '#E5E5EA',
      borderColor: '#E0E0E0',
      borderRadius: 20,
      borderWidth: 1,
      height: 12,
      // lineHeight: 10,
      // padding: 10,
    },
  });

  const renderSend = props => {
    <Send {...props}>
      <View style={styles.sendView}>
        <Text style={styles.sendText}>Send</Text>
      </View>
    </Send>;
  };

  const renderComposer = props => (
    <Composer
      {...props}
      textInputStyle={styles.textInputStyle}
      composerHeight={40}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        showUserAvatar={true}
        // renderComposer={renderComposer}
        // renderSend={renderSend}
        messages={messages}
        onSend={sendMes}
        user={{
          _id: 1,
          name: 'Pepe',
        }}
      />
    </View>
  );
};
