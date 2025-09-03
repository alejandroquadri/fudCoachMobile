// App.tsx or index.js
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingProvider } from '@screens/onboarding';
import { RootStackNavigator } from '@navigation';
import { AuthProvider } from '@hooks';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <OnboardingProvider>
          <RootStackNavigator />
        </OnboardingProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
