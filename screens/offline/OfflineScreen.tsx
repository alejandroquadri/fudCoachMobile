import { COLORS } from '@theme';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from '@rneui/themed';

export const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are offline</Text>
      <Icon
        name="cloud-offline-outline"
        type="ionicon"
        size={70}
        color={COLORS.text}
      />
      <Text style={styles.copy}>
        FoodCoach needs an internet connection to work. Please connect to Wi-Fi
        or mobile data and open the app again.
      </Text>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  copy: {
    width: '70%',
    fontSize: 15,
    marginTop: 20,
  },
});
