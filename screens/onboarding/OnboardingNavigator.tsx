import { FC, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from './context/OnboardingContext';
import { WelcomeScreen } from './WelcomeScreen';
import { EditGenderScreen, ActivityScreen } from '@screens/shared';
import { SignIn } from '@screens/signin-screen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type OnboardingStackParamList = {
  SignIn: undefined;
  Welcome: undefined;
  Gender: undefined;
  Activity: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const steps = ['Welcome', 'Gender', 'Activity'] as const;

export const OnboardingNavigator: FC = () => {
  const { state, dispatch } = useOnboarding();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  useEffect(() => {
    if (state.onboardingStep >= steps.length) {
      // TODO: Here you can finalize onboarding, navigate to Home, etc.
      console.log('Onboarding complete');
      return;
    }

    const nextScreen = steps[state.onboardingStep];
    navigation.navigate(nextScreen);
  }, [state.onboardingStep, navigation]);

  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="SignIn" component={SignIn} />
      <OnboardingStack.Screen name="Gender">
        {() => (
          <EditGenderScreen
            initialValue={state.gender}
            onSave={selectedGender => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'gender',
                value: selectedGender,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={2}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Activity">
        {() => (
          <ActivityScreen
            initialValue={state.activityLevel}
            onSave={selectedActivityLevel => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'activityLevel',
                value: selectedActivityLevel,
              });
              dispatch({ type: 'PREV_STEP' });
            }}
            showProgressBar
            step={3}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
};
