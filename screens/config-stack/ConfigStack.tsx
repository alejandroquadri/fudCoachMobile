import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStack } from '@screens';
import { ConfigScreen } from './ConfigScreen';
import { NotificationsScreen } from './not-screen/NotificationScreen';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View } from 'react-native';

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
      options={{
        headerShown: true,
        title: 'Settings',
        headerLeft: () => (
          <View style={{ marginLeft: -18 }}>
            {/* tweak -8 / -12 until it lines up */}
            <DrawerToggleButton />
          </View>
        ),
      }}
    />
    <Stack.Screen name="ProfileStack" component={ProfileStack} />
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
  </Stack.Navigator>
);
