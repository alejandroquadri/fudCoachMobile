import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, View } from 'react-native';

import ChatDrawerNavigator from "./DrawerNavigator";

type NotificationsScreenNavigationProp = {
  goBack: () => void;
};


type NotificationsScreenProps = {
  navigation: NotificationsScreenNavigationProp;
};

const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={ChatDrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  )
}

export default RootStackNavigator;