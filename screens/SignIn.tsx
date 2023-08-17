import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text>Sign In</Text>
    </View>
  );
};
