import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerNavigator } from './DrawerNavigator';
import { PayWallWrapper } from '@screens';
import { SubscriptionWatcher } from '@hooks';
import { AppParamList } from '@types';

const Stack = createNativeStackNavigator<AppParamList>();

export const AppStackNavigator = () => {
  return (
    <>
      <SubscriptionWatcher />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={DrawerNavigator} />
        <Stack.Screen name="Paywall" component={PayWallWrapper} />
      </Stack.Navigator>
    </>
  );
};
