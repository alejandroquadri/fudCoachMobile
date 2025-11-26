import { useAuth, useSubscription } from '@hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PayWallWrapper, SplashScreen } from '@screens';
import { OnboardingNavigator } from '@screens/onboarding';
import { RootStackParamList } from '@types';
import { DrawerNavigator } from './DrawerNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  const { loading: authLoading, userToken } = useAuth();
  const { status } = useSubscription();

  const loading = authLoading || status === 'checking';

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : // hago que cuando esta unknown tambien permita acceder a la app
      // para mejorar la UX. Igualmente luego rapidamente va a decidir si es
      // active, inactive o  checking
      status === 'active' || status === 'unknown' ? (
        // logged in and subscription ok
        <Stack.Screen name="App" component={DrawerNavigator} />
      ) : (
        // logged in but no subscription
        <Stack.Screen name="Paywall" component={PayWallWrapper} />
      )}
    </Stack.Navigator>
  );
};
