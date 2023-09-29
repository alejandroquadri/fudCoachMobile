import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export const FoodLog = () => {
  return (
    <View style={styles.container}>
      <Text>Food Log</Text>
    </View>
  );
};
