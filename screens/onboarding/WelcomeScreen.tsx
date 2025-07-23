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
    <ScrollView contentContainerStyle={welcomeStyles.container}>
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
        <View style={welcomeStyles.separatorContainer}>
          <Divider width={1} />
          <Text style={welcomeStyles.orText}>or</Text>
          <Divider width={1} />
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  titleAlign: {
    textAlign: 'center',
    width: '100%',
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

// return (
//   <View style={styles.container}>
//     <Text style={styles.title}>Welcome to FudCoach!</Text>
//     <Text style={styles.subtitle}>Let's get started on your goals!</Text>
//     <Button title="Start" onPress={handleStart} />
//
//     {/* Separator */}
//     <View style={welcomeStyles.separatorContainer}>
//       <Divider width={1} />
//       <Text style={welcomeStyles.orText}>or</Text>
//       <Divider width={1} />
//     </View>
//
//     {/* Login Button */}
//     <Button
//       title="I already have an account"
//       type="clear"
//       onPress={handleLogin}
//     />
//   </View>
// );
