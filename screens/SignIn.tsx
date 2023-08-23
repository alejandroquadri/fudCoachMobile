import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../shared/constants';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }

  const { signIn } = auth;

  const handleSignIn = () => {
    setLoading(true); // Start the loading state

    // Simulate an API call with a 2-second delay
    setTimeout(() => {
      const dummyToken = 'your-dummy-token'; // This is just a simulated token
      signIn(dummyToken); // Call the signIn method from the context with the token
      setLoading(false); // End the loading state
    }, 2000);
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
