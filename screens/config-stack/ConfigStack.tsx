import { tr, useLanguageUpdates } from '../../localization';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStack } from '@screens';
import { ConfigScreen } from './ConfigScreen';
import { CoachMemoryScreen } from './CoachMemoryScreen';
import { NotificationsScreen } from './not-screen/NotificationScreen';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { getHeaderTitle, Header } from '@react-navigation/elements';
import { COLORS } from '@theme';

export type ConfigStackParamList = {
  ConfigScreen: undefined;
  CoachMemoryScreen: undefined;
  ProfileStack: undefined;
  NotificationsScreen: undefined;
};

const Stack = createNativeStackNavigator<ConfigStackParamList>();

export const ConfigStack = () => {
  useLanguageUpdates();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ConfigScreen"
        component={ConfigScreen}
        options={{
          headerShown: true,
          title: tr('Settings'),
          header: ({ options, route }) => (
            <Header
              title={getHeaderTitle(options, route.name)}
              headerLeft={() => (
                <DrawerToggleButton tintColor={COLORS.accentColor} />
              )}
            />
          ),
        }}
      />
      <Stack.Screen
        name="CoachMemoryScreen"
        component={CoachMemoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};
