import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { userAPI } from '@api/AuthApi';
import { useAuth } from '@navigation';
import { SharedStyles } from '@theme';
import { RootStackParamList } from '@types';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SignIn = ({
  navigation,
}: {
  navigation: SignInScreenNavigationProp;
}) => {
  const styles = SharedStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log('trato de loguearme', email, password);
      const response = await userAPI.loginEmailPass(email, password);

      console.log('vuelve', response);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={signInStyles.container}>
        <View style={signInStyles.inputContainer}>
          <Input
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChangeText={value => setEmail(value.toLowerCase())}
          />

          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={value => setPassword(value)}
          />
        </View>
        <Button
          title="Sign In"
          onPress={handleSignIn}
          buttonStyle={styles.nextButton}
        />
        <Button
          title="Create account"
          onPress={() => navigation.navigate('Welcome')}
          type="clear"
          buttonStyle={styles.clearButtonText}
          titleStyle={styles.clearButtonText}
        />
      </View>
    </ScrollView>
  );
};

const signInStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 90,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 50,
  },
});
