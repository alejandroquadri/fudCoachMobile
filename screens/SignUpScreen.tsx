import { useContext, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { userAPI } from '../api';
import { COLORS } from '../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming you have a type for your Stack parameters
type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  CompleteProfile: { token: string; refreshToken: string };
  // ... other screens ...
};

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export const SignUp: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }

  const { signUp } = auth;

  const handleSignUp = async () => {
    if (emailError) {
      return;
    }
    setLoading(true);

    // Handle the sign up logic here
    console.log(email, password, name);
    try {
      // const response = await userAPI.signUpEmailPass(email, password, name);
      // const token = response.token;
      // const refreshToken = response.refreshToken;
      // const profile = response.user;

      // signUp(token, refreshToken, profile);

      navigation.navigate('CompleteProfile', {
        token: 'hola loco',
        refreshToken: 'hola de nuevo',
      });
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={value => {
          setEmail(value);
          validateEmail(value);
        }}
        // containerStyle={emailError ? styles.errorInput : null}
        inputStyle={emailError ? styles.errorInput : null}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorInput: {
    // backgroundColor: COLORS.errorRed,
    color: COLORS.errorRed,
  },
});
