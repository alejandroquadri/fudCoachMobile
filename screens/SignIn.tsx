import { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';

import { COLORS } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userAPI } from '../api';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

export const SignIn = ({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLoading] = useState(false);

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }

  const { signIn } = auth;

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log('hago llamada', email, password);

      const response = await userAPI.loginEmailPass(email, password);
      const token = response.data.token;
      // console.log(response.data);

      await SecureStore.setItemAsync('userToken', token); // Store the token securely
      signIn(token);
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={value => setEmail(value)}
        value={email}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        secureTextEntry={true}
        onChangeText={value => setPassword(value)}
        value={password}
      />

      <Button title="Sign In" onPress={handleSignIn} />

      <Divider style={styles.divider} />

      <Button
        title="Google"
        icon={<Icon name="google" size={24} color="white" />}
        buttonStyle={styles.googleButton}
        titleStyle={styles.buttonTitle}
        onPress={() => console.log('Google Sign In Pressed')}
      />
      <Button
        title="Facebook"
        icon={<Icon name="facebook" size={24} color="white" />}
        buttonStyle={styles.facebookButton}
        titleStyle={styles.buttonTitle}
        onPress={() => console.log('Facebook Sign In Pressed')}
      />
      <Button
        title="Apple"
        icon={<Icon name="apple" size={24} color="white" />}
        buttonStyle={styles.appleButton}
        titleStyle={styles.buttonTitle}
        onPress={() => console.log('Apple Sign In Pressed')}
      />
      <View style={styles.createAccountContainer}>
        <Button
          title="Create account"
          onPress={() => navigation.navigate('Sign Up')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    backgroundColor: COLORS.black,
    marginVertical: 5,
  },
  buttonTitle: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  createAccountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  divider: {
    marginVertical: 20,
  },
  facebookButton: {
    backgroundColor: COLORS.facebookBlue,
    marginVertical: 5,
  },
  googleButton: {
    backgroundColor: COLORS.googleRed,
    marginVertical: 5,
  },
});
