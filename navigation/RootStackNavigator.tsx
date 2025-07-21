// navigation/RootStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@screens';
import { DrawerNavigator } from './DrawerNavigator';
import { OnboardingNavigator } from '@screens/onboarding';
import { RootStackParamList } from '@types';
import { useAuth } from './Authcontext';

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

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as SecureStore from 'expo-secure-store';
// import { useEffect, useMemo, useState } from 'react';
//
// import { SplashScreen } from '@screens';
// import { OnboardingNavigator, OnboardingProvider } from '@screens/onboarding';
// import { RootStackParamList, User } from '@types';
// import { AuthContext, AuthContextType } from './Authcontext';
// import { DrawerNavigator } from './DrawerNavigator';
//
// const Stack = createNativeStackNavigator<RootStackParamList>();
//
// export const RootStackNavigator: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [userProfile, setUserProfile] = useState<User | null>(null);
//
//   const getUserToken = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('userToken'); // Fetch the token from secure storage
//       console.log('token', token);
//
//       setUserToken(token);
//     } catch (error) {
//       console.error('Error fetching user token:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const getUserProfile = async () => {
//     try {
//       const profileString = await SecureStore.getItemAsync('userProfile');
//       if (profileString) {
//         const profile: User = JSON.parse(profileString);
//         setUserProfile(profile);
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };
//
//   useEffect(() => {
//     getUserToken();
//     getUserProfile();
//   }, []);
//
//   // uso el useMemo hook porque dependiendo de esto se muestra o no un screen u otro. Por tanto, solo quieo questo se modifique cuando hay un cambio. Si solo quisiera acceder a la variable user (donde esta el profile) no seria necesario usar useMemo
//   const authContext = useMemo<AuthContextType>(
//     () => ({
//       signIn: async (token: string, refreshToken: string, profile: User) => {
//         setUserToken(token);
//         setUserProfile(profile);
//
//         await SecureStore.setItemAsync('userToken', token);
//         await SecureStore.setItemAsync('refreshUserToken', refreshToken);
//         await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
//       },
//       signUp: async (token: string, refreshToken: string, profile: User) => {
//         setUserToken(token);
//         setUserProfile(profile);
//
//         await SecureStore.setItemAsync('userToken', token);
//         await SecureStore.setItemAsync('refreshUserToken', refreshToken);
//         await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
//       },
//       signOut: async () => {
//         console.log('sign out');
//         await SecureStore.deleteItemAsync('userToken');
//         await SecureStore.deleteItemAsync('userProfile');
//         setUserToken(null);
//         setUserProfile(null);
//       },
//       refreshUser: async (user: User) => {
//         console.log('refreshing user', user);
//         setUserProfile(user);
//       },
//       user: userProfile,
//     }),
//     [userProfile]
//   );
//
//   if (isLoading) {
//     return <SplashScreen />;
//   }
//
//   return (
//     <AuthContext.Provider value={authContext}>
//       <OnboardingProvider>
//         <Stack.Navigator>
//           {userToken == null ? (
//             <Stack.Screen
//               name="Onboarding"
//               component={OnboardingNavigator}
//               options={{ headerShown: false }}
//             />
//           ) : (
//             <Stack.Screen
//               name="Home"
//               component={DrawerNavigator}
//               options={{ headerShown: false }}
//             />
//           )}
//         </Stack.Navigator>
//       </OnboardingProvider>
//     </AuthContext.Provider>
//   );
// };
