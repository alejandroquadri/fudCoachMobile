import { useState, useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../shared/constants';

export const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  console.log(insets);

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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.white,
      flex: 1,
      paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
    },
  });

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={newMessages =>
          setMessages(GiftedChat.append(messages, newMessages))
        }
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};
