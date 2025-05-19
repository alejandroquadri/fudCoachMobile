import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.green,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FUD COACH</Text>
    </View>
  );
};
