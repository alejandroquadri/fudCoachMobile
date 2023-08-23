import { useEffect, useMemo, useState } from 'react';
import { AuthContext, AuthContextType } from './Authcontext'; // Adjust the path accordingly
import { SignIn, SplashScreen } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatDrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export const RootStackNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const getUserToken = async () => {
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    try {
      await sleep(3000);
      const token: string | null = null; // This is just for the example, you'd get the token from your auth mechanism
      setUserToken(token);
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
      },
      signOut: () => {
        setUserToken(null);
      },
    }),
    []
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {userToken == null ? (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
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

// import { useEffect, useState } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import ChatDrawerNavigator from './DrawerNavigator';
// import { SignIn, SplashScreen } from '../screens';

// const Stack = createNativeStackNavigator();

// export const RootStackNavigator = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [userToken, setUserToken] = useState<string | null>(null);

//   const getUserToken = async () => {
//     // testing purposes
//     const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
//     try {
//       // custom logic
//       await sleep(3000);
//       const token = null;
//       setUserToken(token);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUserToken();
//   }, []);

//   if (isLoading) {
//     // We haven't finished checking for the token yet
//     return <SplashScreen />;
//   }

//   return (
//     <Stack.Navigator>
//       {userToken == null ? (
//         // No token found, user isn't signed in
//         <Stack.Screen
//           name="SignIn"
//           component={SignIn}
//           options={{
//             title: 'Sign in',
//           }}
//           initialParams={{ setUserToken }}
//         />
//       ) : (
//         // User is signed in
//         <Stack.Screen
//           name="Home"
//           component={ChatDrawerNavigator}
//           options={{ headerShown: false }}
//         />
//       )}
//     </Stack.Navigator>
//   );
// };
