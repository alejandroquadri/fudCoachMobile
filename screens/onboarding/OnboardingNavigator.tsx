import React, { FC, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from './context/OnboardingContext';
import { WelcomeScreen } from './WelcomeScreen';
import { TriedOtherAppsScreen } from './TriedOtherAppsScreen';
import {
  GenderScreen,
  LifeStyleScreen,
  ActivityLevelScreen,
  BirthdateScreen,
  HeightScreen,
  WeightScreen,
} from '../shared';
import { SignIn } from '../signin-screen';
import { LongTermResults } from './LongTermResults';
import { GoalScreen } from './GoalScreen';
import { EcouragementScreen } from './EncouragementScreen';
import { GoalVelocityScreen } from './GoalVelocityScreen';

export type OnboardingStackParamList = {
  SignIn: undefined;
  Welcome: undefined;
  Gender: undefined;
  LifeStyle: undefined;
  ActivityLevel: undefined;
  TriedOtherApps: undefined;
  LongTermResults: undefined;
  Birthdate: undefined;
  Height: undefined;
  Weight: undefined;
  Goal: undefined;
  WeightGoal: undefined;
  Encouragement: undefined;
  GoalVelocity: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const steps = [
  'Welcome',
  'Gender',
  'LifeStyle',
  'ActivityLevel',
  'TriedOtherApps',
  'LongTermResults',
  'Birthdate',
  'Height',
  'Weight',
  'Goal',
  'WeightGoal',
  'Encouragement',
  'GoalVelocity',
] as const;

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
          <GenderScreen
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
      <OnboardingStack.Screen name="LifeStyle">
        {() => (
          <LifeStyleScreen
            initialValue={state.lifeStyle}
            onSave={selectedLifestyle => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'lifeStyle',
                value: selectedLifestyle,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={3}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="ActivityLevel">
        {() => (
          <ActivityLevelScreen
            initialValue={state.activityLevel}
            onSave={activityLevel => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'activityLevel',
                value: activityLevel,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={4}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="TriedOtherApps">
        {() => (
          <TriedOtherAppsScreen
            initialValue={state.triedOtherApps}
            onSave={triedOtherApps => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'triedOtherApps',
                value: triedOtherApps,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={5}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="LongTermResults">
        {() => (
          <LongTermResults
            onNext={() => {
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={6}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Birthdate">
        {() => (
          <BirthdateScreen
            initialValue={state.birthdate}
            onSave={birthdate => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'birthdate',
                value: birthdate,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={7}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Height">
        {() => (
          <HeightScreen
            initialValue={state.height}
            unitType={state.unitType}
            onSave={ret => {
              console.log('recibo este height', ret);
              const { unitType, height } = ret;
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'height',
                value: height,
              });
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'unitType',
                value: unitType,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={8}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Weight">
        {() => (
          <WeightScreen
            initialValue={state.weight}
            unitType={state.unitType}
            title="What is your current weight?"
            onSave={ret => {
              const { unitType, weight } = ret;
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'weight',
                value: weight,
              });
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'unitType',
                value: unitType,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={9}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Goal">
        {() => (
          <GoalScreen
            initialValue={state.goal}
            onSave={goal => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'goal',
                value: goal,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={10}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="WeightGoal">
        {() => (
          <WeightScreen
            initialValue={state.weight}
            unitType={state.unitType}
            title="What is your desired weight?"
            onSave={ret => {
              const { unitType, weight } = ret;
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'weightGoal',
                value: weight,
              });
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'unitType',
                value: unitType,
              });
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={11}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="Encouragement">
        {() => (
          <EcouragementScreen
            weightDelta={state.weight! - state.weightGoal!}
            unitType={state.unitType!}
            onNext={() => {
              dispatch({ type: 'NEXT_STEP' });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={12}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
      <OnboardingStack.Screen name="GoalVelocity">
        {() => (
          <GoalVelocityScreen
            initialValue={state.goalVelocity}
            unitType={state.unitType!}
            onSave={(goalVelocity: number) => {
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'goalVelocity',
                value: goalVelocity,
              });
            }}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={13}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
};
