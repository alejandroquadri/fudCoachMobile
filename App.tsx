import { NavigationContainer } from '@react-navigation/native';
import { OnboardingProvider } from '@screens/onboarding';
import { RootStackNavigator } from '@navigation';
import { AuthProvider, NetworkProvider } from '@hooks';
import { SubscriptionProvider } from '@hooks/useSubscription';

export default function App() {
  return (
    <NetworkProvider>
      <NavigationContainer>
        <AuthProvider>
          <SubscriptionProvider>
            <OnboardingProvider>
              <RootStackNavigator />
            </OnboardingProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </NavigationContainer>
    </NetworkProvider>
  );
}
