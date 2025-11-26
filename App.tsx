import { NavigationContainer } from '@react-navigation/native';
import { OnboardingProvider } from '@screens/onboarding';
import { RootStackNavigator } from '@navigation';
import { AuthProvider } from '@hooks';
import { SubscriptionProvider } from '@hooks/useSubscription';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SubscriptionProvider>
          <OnboardingProvider>
            <RootStackNavigator />
          </OnboardingProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
