import * as React from 'react';
import { useState, useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import Goals from './Goals';

// const Drawer = createDrawerNavigator();


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
  

  return (
    <View
    style={{
      // paddingTop: insets.top,
      paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
      backgroundColor: 'white',
      flex: 1,}}
      >

      <GiftedChat
        messages={messages}
        onSend={newMessages => setMessages(GiftedChat.append(messages, newMessages))}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}