import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, Alert, View, Text } from 'react-native';
import { useOnboarding } from './context/OnboardingContext';

import { Overlay } from '@rneui/themed';

import { useAuth } from '@hooks';
import { api } from '@api/ApiInstance';
import { userAPI } from '@api/AuthApi';
import { COLORS } from '@theme';
import {
  ActivityLevelScreen,
  BirthdateScreen,
  GenderScreen,
  HeightScreen,
  LifeStyleScreen,
  WeightScreen,
  SourcesScreen,
} from '../shared';
import { SignIn } from './SignInScreen';
import { ChartToGoalScreen } from './ChartToGoalScreen';
import { DietTypeScreen } from './DietTypeScreen';
import { EcouragementScreen } from './EncouragementScreen';
import { GoalObstacleScreen } from './GoalObstaclesScreen';
import { GoalScreen } from './GoalScreen';
import { GoalVelocityScreen } from './GoalVelocityScreen';
import { LongTermResults } from './LongTermResults';
import { MoreEffective } from './MoreEffectiveScreen';
import { OutcomeScreen } from './OutcomeScreen';
import { PrepPlanScreen } from './PrepPlanScreen';
import { SignUpScreen } from './SignUpScreen';
import { TriedOtherAppsScreen } from './TriedOtherAppsScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { RegistrationUserInput, UserProfile } from '@types';
import { appleLogin, createInitialNotificatinJobs } from '@services';

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
  MoreEffective: undefined;
  GoalObstacles: undefined;
  DietType: undefined;
  Outcome: undefined;
  ChartToGoal: undefined;
  PrepPlan: undefined;
  SignUp: undefined;
  Sources: undefined;
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
  'MoreEffective',
  'GoalObstacles',
  'DietType',
  'Outcome',
  'ChartToGoal',
  'PrepPlan',
  'SignUp',
] as const;

export const OnboardingNavigator: FC = () => {
  const { state, dispatch } = useOnboarding();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const [submitting, setSubmitting] = useState(false);

  const { signUp } = useAuth();

  const buildRegistrationData = (
    overrides: Partial<RegistrationUserInput>
  ): RegistrationUserInput => {
    const registrationData: Partial<UserProfile> & {
      onboardingStep?: number;
    } = { ...state, ...overrides };
    delete registrationData.onboardingStep;
    delete registrationData._id;
    delete registrationData.createdAt;
    delete registrationData.updatedAt;
    delete registrationData.providers;
    delete registrationData.appleSub;
    delete registrationData.appleEmailPrivateRelay;
    delete registrationData.appAccountToken;
    delete registrationData.entitlement;
    delete registrationData.deliveredWelcome;
    return registrationData as RegistrationUserInput;
  };

  const completeAccountCreation = async (response: {
    token: string;
    refreshToken: string;
    user: UserProfile;
  }) => {
    const { token, refreshToken, user } = response;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    await signUp(token, refreshToken, user);
    dispatch({ type: 'RESET' });

    try {
      await createInitialNotificatinJobs(user._id);
    } catch (error) {
      console.warn('Unable to initialize notification jobs', error);
    }
  };

  const registerEmailPass = async (
    name: string,
    email: string,
    password: string
  ) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const userData = buildRegistrationData({ name, email, password });
      const response = await userAPI.register(userData);
      await completeAccountCreation(response);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Sign Up',
        'Could not complete email sign up. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const appleSignUp = async (idToken: string, name: string, email: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const userData = buildRegistrationData({
        name,
        email: email.toLowerCase(),
      });
      const response = await appleLogin(idToken, true, userData);
      if (response) await completeAccountCreation(response);
    } catch (e) {
      Alert.alert(
        'Sign Up',
        'Could not complete Apple sign up. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (state.onboardingStep >= steps.length) return;

    const nextScreen = steps[state.onboardingStep];
    navigation.navigate(nextScreen);
  }, [state.onboardingStep, navigation]);

  return (
    <>
      <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
        <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
        <OnboardingStack.Screen name="SignIn" component={SignIn} />
        <OnboardingStack.Screen name="Sources" component={SourcesScreen} />
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
              initialValue={state.initWeight}
              unitType={state.unitType}
              title="What is your current weight?"
              onSave={ret => {
                const { unitType, weight } = ret;
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'initWeight',
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
              initialValue={state.weightGoal || state.initWeight}
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
              weightDelta={state.initWeight! - state.weightGoal!}
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
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={13}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="MoreEffective">
          {() => (
            <MoreEffective
              onNext={() => {
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={14}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="GoalObstacles">
          {() => (
            <GoalObstacleScreen
              initialValue={state.goalObstacle}
              onSave={goalObstacle => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'goalObstacle',
                  value: goalObstacle,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={15}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>

        <OnboardingStack.Screen name="DietType">
          {() => (
            <DietTypeScreen
              initialValue={state.dietType}
              onSave={dietType => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'dietType',
                  value: dietType,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={16}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="Outcome">
          {() => (
            <OutcomeScreen
              initialValue={state.outcome}
              onSave={outcome => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'outcome',
                  value: outcome,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={17}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>

        <OnboardingStack.Screen name="ChartToGoal">
          {() => (
            <ChartToGoalScreen
              currentWeight={state.initWeight!}
              goalWeight={state.weightGoal!}
              pace={state.goalVelocity!}
              unit={state.unitType!}
              onNext={() => {
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={18}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="PrepPlan">
          {() => (
            <PrepPlanScreen
              currentState={state}
              onNext={nutritionGoals => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'nutritionGoals',
                  value: nutritionGoals,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={19}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="SignUp">
          {() => (
            <SignUpScreen
              onSave={registerEmailPass}
              onApple={appleSignUp}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={20}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
      </OnboardingStack.Navigator>

      {/* Blocking loader overlay */}
      <Overlay
        isVisible={submitting}
        backdropStyle={{ backgroundColor: COLORS.backDrop }}
        overlayStyle={onboardingNavStyles.overlay}>
        <View style={onboardingNavStyles.activityWrapper}>
          <ActivityIndicator size="large" />
          <Text style={onboardingNavStyles.activityText}>
            Creating your account…
          </Text>
        </View>
      </Overlay>
    </>
  );
};

const onboardingNavStyles = StyleSheet.create({
  overlay: { padding: 24, borderRadius: 12 },
  activityWrapper: { alignItems: 'center' },
  activityText: { marginTop: 12 },
});
