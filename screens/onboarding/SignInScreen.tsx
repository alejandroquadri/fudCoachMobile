import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  Text,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { userAPI } from '@api/AuthApi';
import { useAuth } from '@hooks';
import { SharedStyles } from '@theme';
import { OnboardingStackParamList } from './OnboardingNavigator';
// If you want to type userData we send to backend:
import { UserProfile } from '@types';
import { appleLogin } from '@services';

type Props = NativeStackNavigationProp<OnboardingStackParamList, 'SignIn'>;

function fullNameToString(
  fullName?: AppleAuthentication.AppleAuthenticationFullName | null
) {
  if (!fullName) return '';
  const parts = [
    fullName.givenName?.trim(),
    fullName.middleName?.trim(),
    fullName.familyName?.trim(),
  ].filter(Boolean);
  return parts.join(' ').trim();
}

export const SignIn = ({ navigation }: { navigation: Props }) => {
  const styles = SharedStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const { signIn } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const available =
          Platform.OS === 'ios' &&
          (await AppleAuthentication.isAvailableAsync());
        setAppleAvailable(!!available);
      } catch {
        setAppleAvailable(false);
      }
    })();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await userAPI.loginEmailPass(email, password);
      const { token, refreshToken, user: profile } = response; // adjust if needed
      signIn(token, refreshToken, profile);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
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

      // Apple only sends fullName/email the FIRST time the user authorizes your app.
      // If present, pass them so backend can save a real name instead of "New User".
      const appleName = fullNameToString(credential.fullName);
      const maybeEmail = credential.email?.toLowerCase();

      const userData: Partial<UserProfile> | undefined =
        appleName || maybeEmail
          ? {
              ...(appleName ? { name: appleName } : {}),
              ...(maybeEmail ? { email: maybeEmail } : {}),
            }
          : undefined;

      const result = await appleLogin(
        credential.identityToken,
        false,
        userData!
      );

      if (!result) return;

      const { token, refreshToken, user } = result;

      // Done — same auth path as email+password
      signIn(token, refreshToken, user);
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') return; // user canceled
      Alert.alert('Apple Sign In failed', 'Please try again.');
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
            autoCapitalize="none"
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

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Apple Sign In button */}
        {appleAvailable && (
          <View style={{ marginTop: 16 }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={14}
              style={{ width: '100%', height: 44 }}
              onPress={handleAppleSignIn}
            />
          </View>
        )}

        <View style={signInStyles.separator}></View>

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
    marginBottom: 10,
  },
  separator: {
    flex: 1,
  },
});
