import { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

import { COLORS } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { userAPI } from '../api';

type RootStackParamList = {
  'Sign in': undefined;
  Registration: undefined;
  // 'Sign up': undefined;
};

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Sign in'
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
      const response = await userAPI.loginEmailPass(email, password);
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      const profile = response.data.user;

      signIn(token, refreshToken, profile);
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
        leftIconContainerStyle={styles.inputs}
        onChangeText={value => setEmail(value.toLowerCase())}
        value={email}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        leftIconContainerStyle={styles.inputs}
        secureTextEntry={true}
        onChangeText={value => setPassword(value)}
        value={password}
      />

      {/* <Divider style={styles.divider} />

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
      /> */}
      <View style={styles.btnContainer}>
        <Button
          title="Sign in"
          onPress={handleSignIn}
          buttonStyle={styles.signInBtn}
        />

        <Button
          title="Create account"
          // onPress={() => navigation.navigate('Sign up')}
          onPress={() => navigation.navigate('Registration')}
          buttonStyle={styles.textButton}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // appleButton: {
  //   backgroundColor: COLORS.black,
  //   marginVertical: 5,
  // },
  // buttonTitle: {
  //   marginLeft: 10,
  // },
  btnContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  buttonTitle: {
    color: COLORS.black,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 90,
    padding: 20,
  },
  inputs: {
    paddingRight: 10,
  },
  signInBtn: {
    // width: '100%',
  },
  textButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 0,
  },

  // divider: {
  //   marginVertical: 20,
  // },
  // facebookButton: {
  //   backgroundColor: COLORS.facebookBlue,
  //   marginVertical: 5,
  // },
  // googleButton: {
  //   backgroundColor: COLORS.googleRed,
  //   marginVertical: 5,
  // },
});
