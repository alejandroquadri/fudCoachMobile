import React, { useEffect, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon, Input } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';

interface SignUpProps {
  onSave: (name: string, email: string, password: string) => void;
  onBack: () => void;
  onApple?: (
    idToken: string,
    name: string,
    email: string
  ) => Promise<void> | void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}
export const SignUpScreen = ({
  onSave,
  onBack,
  onApple,
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
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    // Apple Sign In is iOS only and must be checked at runtime
    (async () => {
      try {
        setAppleAvailable(
          Platform.OS === 'ios' &&
            (await AppleAuthentication.isAvailableAsync())
        );
      } catch {
        setAppleAvailable(false);
      }
    })();
  }, []);

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

  const fullNameToString = (
    fullName?: AppleAuthentication.AppleAuthenticationFullName | null
  ) => {
    if (!fullName) return '';
    const parts = [
      fullName.givenName?.trim(),
      fullName.middleName?.trim(),
      fullName.familyName?.trim(),
    ].filter(Boolean);
    return parts.join(' ').trim();
  };

  const handleApple = async () => {
    try {
      if (!appleAvailable) return;

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        Alert.alert(
          'Apple Sign In',
          'No identity token returned. Try again on a real device.'
        );
        return;
      }

      // Prefer Apple-provided values when available (only on first grant)
      const appleName = fullNameToString(credential.fullName);
      const resolvedName = (appleName || name).trim();
      const resolvedEmail = (credential.email ?? email ?? '').toLowerCase();

      if (onApple) {
        await onApple(credential.identityToken, resolvedName, resolvedEmail);
      }
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Apple Sign In failed', 'Please try again.');
    }
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

        {appleAvailable && (
          <View style={{ marginTop: 16 }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={6}
              style={{ width: '100%', height: 44 }}
              onPress={handleApple}
            />
          </View>
        )}
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
