import { useEffect, useMemo, useState } from 'react';
import { AuthContext, AuthContextType } from './Authcontext';
import {
  SignIn,
  SignUp,
  SplashScreen,
  CompleteProfileScreen,
} from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatDrawerNavigator from './DrawerNavigator';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { userAPI } from '../api';

type RootStackParamList = {
  'Sign in': undefined;
  'Sign up': undefined;
  Profile: { token: string; refreshToken: string };
  Home: undefined;
  // define other screens here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const getUserToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken'); // Fetch the token from secure storage
      console.log('token', token);

      setUserToken(token);
    } catch (error) {
      console.error('Error fetching user token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      const profileString = await SecureStore.getItemAsync('userProfile');
      if (profileString) {
        const profile: User = JSON.parse(profileString);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    getUserToken();
    getUserProfile();
  }, []);

  // uso el useMemo hook porque dependiendo de esto se muestra o no un screen u otro. Por tanto, solo quieo questo se modifique cuando hay un cambio. Si solo quisiera acceder a la variable user (donde esta el profile) no seria necesario usar useMemo
  const authContext = useMemo<AuthContextType>(
    () => ({
      signIn: async (token: string, refreshToken: string, profile: User) => {
        setUserToken(token);
        setUserProfile(profile);

        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
      },
      signUp: async (token: string, refreshToken: string, profile: User) => {
        setUserToken(token);
        setUserProfile(profile);

        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('refreshUserToken', refreshToken);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(profile));
      },
      signOut: async () => {
        console.log('sign out');
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userProfile');
        setUserToken(null);
        setUserProfile(null);
      },
      updateUser: async (user: User) => {
        const response = await userAPI.getProfile(user._id);
        const updatedUser = response.data;
        setUserProfile(updatedUser);
      },
      user: userProfile,
    }),
    [userProfile]
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {userToken == null ? (
          <>
            <Stack.Screen name="Sign in" component={SignIn} />
            <Stack.Screen name="Sign up" component={SignUp} />
            <Stack.Screen name="Profile" component={CompleteProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={ChatDrawerNavigator}
              options={{ headerShown: false }}
            />
            {/* Add other screens that should be accessible after the user is authenticated */}
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};
