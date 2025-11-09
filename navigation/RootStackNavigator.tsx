import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@screens';
import { DrawerNavigator } from './DrawerNavigator';
import { OnboardingNavigator } from '@screens/onboarding';
import { RootStackParamList } from '@types';
import { useAuth } from '@hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  const { loading, userToken } = useAuth(); // ← context is now consumed

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="Home" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};
