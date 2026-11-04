import { COLORS } from '@theme';
import { StyleSheet } from 'react-native';

export const ChatStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: COLORS.cardBackground,
      flex: 1,
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
    photoMessage: {
      alignSelf: 'flex-end',
      borderRadius: 16,
      overflow: 'hidden',
    },
    chatPhoto: {
      width: 200,
      height: 200,
      margin: 0,
      borderRadius: 16,
    },
    photoTime: {
      position: 'absolute',
      right: 8,
      bottom: 7,
      color: 'white',
      fontSize: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    photoRetry: {
      position: 'absolute',
      left: 8,
      bottom: 7,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    photoRetryText: { color: 'white', fontWeight: '600' },
    showSettingsText: {
      color: COLORS.accentColor,
    },
    cancelSettingsText: {
      color: COLORS.divider,
    },
  });
};
