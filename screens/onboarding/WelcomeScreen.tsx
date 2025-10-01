import React, { FC } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useOnboarding } from './context/OnboardingContext';
import { Button, Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { SharedStyles } from '@theme';

export const WelcomeScreen: FC = () => {
  const styles = SharedStyles();
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
    <ScrollView
      contentContainerStyle={[styles.container, styles.containerCenter]}>
      <View style={welcomeStyles.content}>
        <Text style={[styles.title, welcomeStyles.titleAlign]}>
          Welcome to FudCoach!
        </Text>
        <Text style={[styles.subtitle, welcomeStyles.titleAlign]}>
          Let's get started on your goals!
        </Text>
        <Button
          buttonStyle={styles.nextButton}
          titleStyle={styles.nextButtonText}
          title="Start"
          onPress={handleStart}
        />

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Login Button */}
        <Button
          title="I already have an account"
          type="clear"
          titleStyle={styles.clearButtonText}
          onPress={handleLogin}
        />
      </View>
    </ScrollView>
  );
};

const welcomeStyles = StyleSheet.create({
  content: {
    width: '100%',
  },
  titleAlign: {
    textAlign: 'center',
    width: '100%',
  },
});
