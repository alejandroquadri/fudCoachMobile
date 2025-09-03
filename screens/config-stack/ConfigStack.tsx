import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStack } from '@screens';
import { ConfigScreen } from './ConfigScreen';
import { NotificationsScreen } from './NotificationScreen';

export type ConfigStackParamList = {
  ConfigScreen: undefined;
  ProfileStack: undefined;
  NotificationsScreen: undefined;
};

const Stack = createNativeStackNavigator<ConfigStackParamList>();

export const ConfigStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ConfigScreen"
      component={ConfigScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen
      name="ProfileStack"
      component={ProfileStack}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NotificationsScreen"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
  </Stack.Navigator>
);
