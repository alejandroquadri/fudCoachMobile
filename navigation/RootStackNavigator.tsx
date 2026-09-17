import { useAuth, useNetwork, useSubscription } from '@hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OfflineScreen, PayWallWrapper, LoadingScreen } from '@screens';
import { OnboardingNavigator } from '@screens/onboarding';
import { RootStackParamList } from '@types';
import { DrawerNavigator } from './DrawerNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  const { loading: authLoading, userToken } = useAuth();
  const { status } = useSubscription();
  const { online } = useNetwork();

  const loading =
    authLoading ||
    (userToken != null && (status === 'unknown' || status === 'checking'));

  if (loading) return <LoadingScreen />;
  if (online === 'no') return <OfflineScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : status === 'active' ? (
        // logged in and subscription ok
        <Stack.Screen name="App" component={DrawerNavigator} />
      ) : (
        // logged in but no subscription
        <Stack.Screen name="Paywall" component={PayWallWrapper} />
      )}
    </Stack.Navigator>
  );
};
