import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOnboarding } from './context/OnboardingContext';
import { StepProgressBar } from '@components';
import { Button, Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './OnboardingNavigator';

export const WelcomeScreen: FC = () => {
  const { dispatch } = useOnboarding();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleStart = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleLogin = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FudCoach!</Text>
      <Text style={styles.subtitle}>Let's get started on your goals!</Text>
      <Button title="Start" onPress={handleStart} />

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <Divider width={1} />
        <Text style={styles.orText}>or</Text>
        <Divider width={1} />
      </View>

      {/* Login Button */}
      <Button
        title="I already have an account"
        type="clear"
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#999',
  },
});
