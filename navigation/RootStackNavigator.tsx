import { useEffect, useMemo, useState } from 'react';
import { AuthContext, AuthContextType } from './Authcontext'; // Adjust the path accordingly
import { SignIn, SignUp, SplashScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatDrawerNavigator from './DrawerNavigator';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

export const RootStackNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const getUserToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken'); // Fetch the token from secure storage
      setUserToken(token);
    } catch (error) {
      console.error('Error fetching user token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  const authContext = useMemo<AuthContextType>(
    () => ({
      signIn: async (token: string) => {
        setUserToken(token);
        await SecureStore.setItemAsync('userToken', token);
      },
      signOut: async () => {
        console.log('viene un sign out');

        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
      },
    }),
    [userToken]
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {userToken == null ? (
          <>
            <Stack.Screen name="Sign In" component={SignIn} />
            <Stack.Screen name="Sign Up" component={SignUp} />
            {/* You can add other screens related to the authentication flow here */}
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
