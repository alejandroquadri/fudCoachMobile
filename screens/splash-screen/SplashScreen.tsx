import { COLORS } from '@theme';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.subText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
});
