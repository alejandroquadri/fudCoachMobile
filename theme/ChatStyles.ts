import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';

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
    // ... any other styles you want to define
  });
};
