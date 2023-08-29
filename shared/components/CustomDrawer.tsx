import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useContext } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';
import { AuthContext, AuthContextType } from '../../navigation/Authcontext';

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('CustomDrawer must be used within an AuthProvider');
  }

  const { signOut } = auth;

  const signOutUser = async () => {
    console.log('trying to signout');
    await signOut();
    // props.navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'SignIn' }],
    // });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Help"
          onPress={() => Linking.openURL('https://quadri.com.ar')}
        />
        <DrawerItem
          label="Chat2"
          onPress={() => props.navigation.navigate('Chat')}
        />
        <DrawerItem label="Sign out" onPress={signOutUser} />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.green,
    flex: 1,
  },
});
