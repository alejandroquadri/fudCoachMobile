import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOnboarding } from './context/OnboardingContext';
import { StepProgressBar } from '@components';
import { Button } from '@rneui/themed';

export const WelcomeScreen: FC = () => {
  const { dispatch } = useOnboarding();

  const handleStart = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  return (
    <View style={styles.container}>
      <StepProgressBar step={1} totalSteps={5} />
      <Text style={styles.title}>Welcome to FudCoach!</Text>
      <Text style={styles.subtitle}>Let's get started on your goals!</Text>
      <Button title="Start" onPress={handleStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});
