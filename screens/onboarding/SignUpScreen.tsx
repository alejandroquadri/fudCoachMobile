import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon, Input } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';

interface SignUpProps {
  onSave: (name: string, email: string, password: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}
export const SignUpScreen = ({
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: SignUpProps) => {
  const styles = SharedStyles();
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

  const handleSignUp = async () => {
    validateEmail(email);
    validateName(name);
    validatePassword(password);

    if (!!emailError || !!nameError || !!passwordError) {
      return;
    }

    onSave(name, email, password);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      <View style={signUpStyles.container}>
        <View style={signUpStyles.inputContainer}>
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
        </View>
        <Button
          title="Create account"
          onPress={handleSignUp}
          buttonStyle={styles.nextButton}
          disabled={!!emailError || !!nameError || !!passwordError}
        />
      </View>
    </ScrollView>
  );
};

const signUpStyles = StyleSheet.create({
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
