import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRegistration } from '../../navigation/RegistrationContext';
import { TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types';

// Assuming you have a type for your Stack parameters
// type RootStackParamList = {
//   'Sign in': undefined;
//   'Sign up': undefined;
//   Profile: undefined;
//   // Profile: { name: string; email: string; password: string };
//   // ... other screens ...
// };

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'Sign up'>;

export const SignUp: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const emailErrorString = 'Please enter a valid email address';
  const nameErrorString = 'Name cannot be empty';
  const passwordErrorString = 'Password must be longer than 6 characters';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(emailErrorString);
  const [nameError, setNameError] = useState(nameErrorString);
  const [passwordError, setPasswordError] = useState(passwordErrorString);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  const validateName = (name: string) => {
    if (name.trim() === '') {
      setNameError(nameErrorString);
    } else {
      setNameError('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(emailErrorString);
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    if (password.length <= 6) {
      setPasswordError(passwordErrorString);
    } else {
      setPasswordError('');
    }
  };

  const { setRegistrationData } = useRegistration();

  const handleSignUp = async () => {
    validateEmail(email);
    validateName(name);
    validatePassword(password);

    if (!!emailError || !!nameError || !!passwordError) {
      return;
    }

    setRegistrationData({ name, email, password });

    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={value => {
          setName(value);
          validateName(value);
        }}
        onBlur={() => setNameBlurred(true)}
        errorMessage={nameBlurred && nameError ? nameError : ''}
      />
      <Input
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={value => {
          setEmail(value.toLowerCase());
          // setEmail(value);
          validateEmail(value);
        }}
        onBlur={() => setEmailBlurred(true)}
        errorMessage={emailBlurred && emailError ? emailError : ''}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={value => {
          setPassword(value);
          validatePassword(value);
        }}
        onBlur={() => setPasswordBlurred(true)}
        errorMessage={passwordBlurred && passwordError ? passwordError : ''}
      />
      <Button
        title="Next"
        onPress={handleSignUp}
        buttonStyle={styles.signUpBtnStyle}
        disabled={!!emailError || !!nameError || !!passwordError}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already a user? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign in')}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 90,
    padding: 20,
  },
  loginButton: {
    fontSize: 16,
    color: '#007bff', // Set the color you want for the button text
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
  },
  signUpBtnStyle: {
    marginTop: 20,
  },
});
