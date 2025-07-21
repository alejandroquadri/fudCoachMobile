// App.tsx or index.js
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingProvider } from '@screens/onboarding';
import { AuthProvider, RootStackNavigator } from '@navigation';

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

// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
//
// import { RootStackNavigator } from './navigation/RootStackNavigator';
//
// export default function App() {
//   return (
//     <NavigationContainer>
//       <RootStackNavigator />
//     </NavigationContainer>
//   );
// }
