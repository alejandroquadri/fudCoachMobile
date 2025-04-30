import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const ChatStyles = (
  isKeyboardVisible: boolean,
  insetsBottom: number
) => {
  return StyleSheet.create({
    container: {
      backgroundColor: COLORS.white,
      flex: 1,
      paddingBottom: isKeyboardVisible ? 0 : insetsBottom,
    },
    actionWrapper: {
      height: 44, // same as the default minInputToolbarHeight in GiftedChat
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    iconsCamera: {
      marginTop: 0,
      marginLeft: 5,
      marginRight: 5,
    },
    sendButtonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginRight: 15,
    },
    iconsSend: {
      justifyContent: 'center',
    },
    // ... any other styles you want to define
  });
};
