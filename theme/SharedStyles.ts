import { StyleSheet } from 'react-native';
import { COLORS } from './ColorsStyles';

export const SharedStyles = () => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 40,
      justifyContent: 'space-between',
      flexGrow: 1,
    },
    header: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 30, // same as the progress bar's visual height
      marginRight: 12,
    },
    progressBar: {
      flex: 1,
    },
    content: {
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      width: '80%',
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.subText,
      marginBottom: 30,
      textAlign: 'center',
      width: '80%',
    },
    optionsContainer: {
      width: '100%',
      gap: 12,
    },
    optionButton: {
      backgroundColor: COLORS.backgroundColor,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    optionSelectedButton: {
      backgroundColor: COLORS.primaryColor,
    },
    optionText: {
      fontSize: 16,
      color: COLORS.primaryColor,
    },
    optionTextSelected: {
      color: COLORS.primaryContrast,
      fontWeight: 'bold',
    },
    nextButton: {
      borderRadius: 16,
      paddingVertical: 14,
      backgroundColor: COLORS.primaryColor,
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};
