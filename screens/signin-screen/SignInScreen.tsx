import { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, Button } from '@rneui/themed';

import { COLORS } from '@theme';
import { AuthContext, AuthContextType } from '@navigation';
import { userAPI } from '@api/AuthApi';
import { RootStackParamList } from '@types';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

      <View style={styles.btnContainer}>
        <Button
          title="Sign in"
          onPress={handleSignIn}
          buttonStyle={styles.signInBtn}
        />

        <Button
          title="Create account"
          onPress={() => navigation.navigate('Welcome')}
          buttonStyle={styles.textButton}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
