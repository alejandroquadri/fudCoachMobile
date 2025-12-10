import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { wipeSecureStore } from '@utils';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingStackParamList } from './OnboardingNavigator';
import { useOnboarding } from './context/OnboardingContext';

export const WelcomeScreen = () => {
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

  const toSources = () => {
    navigation.navigate('Sources');
  };

  const wipeSecureStoreKeys = async () => {
    try {
      console.log('trying to wipe keys');
      await wipeSecureStore();
      console.log('secure store keys wiped');
    } catch (err) {
      console.log('Error wiping secure store', err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, styles.containerCenter]}>
      <View style={welcomeStyles.content}>
        <Text style={[styles.title, welcomeStyles.titleAlign]}>
          Welcome to Food Coach!
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
        {/* Wipe SecureStore keys */}
        {/* <Button */}
        {/*   title="Wipe SecureStore" */}
        {/*   type="clear" */}
        {/*   buttonStyle={welcomeStyles.wipeButton} */}
        {/*   titleStyle={welcomeStyles.wipeButtonText} */}
        {/*   onPress={wipeSecureStoreKeys} */}
        {/* /> */}

        {/* <Button */}
        {/*   title="see sources" */}
        {/*   type="clear" */}
        {/*   buttonStyle={welcomeStyles.wipeButton} */}
        {/*   titleStyle={welcomeStyles.wipeButtonText} */}
        {/*   onPress={toSources} */}
        {/* /> */}
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
  wipeButtonText: {
    color: COLORS.danger,
  },
  wipeButton: {
    marginTop: 80,
  },
});
