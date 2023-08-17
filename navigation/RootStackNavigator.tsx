import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatDrawerNavigator from './DrawerNavigator';
import { SignIn, SplashScreen } from '../screens';

const Stack = createNativeStackNavigator();

export const RootStackNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const getUserToken = async () => {
    // testing purposes
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    try {
      // custom logic
      await sleep(3000);
      const token = 'pepe';
      setUserToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {userToken == null ? (
        // No token found, user isn't signed in
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            title: 'Sign in',
          }}
          initialParams={{ setUserToken }}
        />
      ) : (
        // User is signed in
        <Stack.Screen
          name="Home"
          component={ChatDrawerNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

// type NotificationsScreenNavigationProp = {
//   goBack: () => void;
// };

// type NotificationsScreenProps = {
//   navigation: NotificationsScreenNavigationProp;
// };

// const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
//   const styles = StyleSheet.create({
//     container: {
//       alignItems: 'center',
//       flex: 1,
//       justifyContent: 'center',
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <Text>Goals</Text>
//       <Button onPress={() => navigation.goBack()} title="Go back home" />
//     </View>
//   );
// };

// return (
//   <Stack.Navigator initialRouteName="Home">
//     <Stack.Screen
//       name="Home"
//       component={ChatDrawerNavigator}
//       options={{ headerShown: false }}
//     />
//     <Stack.Screen name="Notifications" component={NotificationsScreen} />
//   </Stack.Navigator>
// );
