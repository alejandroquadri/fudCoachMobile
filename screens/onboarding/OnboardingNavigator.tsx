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
  PaywallScreen,
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
import { UserProfile } from '@types';
import { createInitialNotificatinJobs } from '@services';

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
  PayWall: undefined;
  SignUp: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const steps = [
  'Welcome',
  // 'PayWall',
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
  'PayWall',
  'SignUp',
] as const;

export const OnboardingNavigator: FC = () => {
  const { state, dispatch } = useOnboarding();
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const [appleIdToken, setAppleIdToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // 👈 NEW

  const { signUp } = useAuth();

  const registerData = async () => {
    if (submitting) return; // 👈 prevent double-fire
    setSubmitting(true);
    try {
      if (appleIdToken !== null) {
        await appleSignUp();
      } else {
        await registerEmailPass();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const registerEmailPass = async () => {
    try {
      const { onboardingStep, ...userData } = state as {
        onboardingStep: number;
      } & UserProfile;

      const response = await userAPI.register(userData);

      const { token, refreshToken, user } = response;

      // 🔑 Prime axios with the token before making any protected calls
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Registro jobs de notifications
      await createInitialNotificatinJobs(response.user._id);
      dispatch({ type: 'RESET' });
      signUp(token, refreshToken, user);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Sign Up',
        'Could not complete email sign up. Please try again.'
      );
    }
  };

  // const appleSignUp = async (idToken: string, name: string, email: string) => {
  const appleSignUp = async () => {
    try {
      // Build full userData from onboarding state
      const { onboardingStep, ...base } = state as {
        onboardingStep: number;
      } & UserProfile;

      const userData: UserProfile = {
        ...(base as UserProfile),
        name: base.name,
        email: (base.email || '').toLowerCase(),
      };

      const response = await userAPI.loginApple(
        appleIdToken as string,
        true,
        userData
      );

      const { token, refreshToken, user } = response;

      // 🔑 Prime axios with the token before making any protected calls
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Registro jobs de notifications
      await createInitialNotificatinJobs(response.user._id);

      dispatch({ type: 'RESET' });
      signUp(token, refreshToken, user);
    } catch (e) {
      Alert.alert(
        'Sign Up',
        'Could not complete Apple sign up. Please try again.'
      );
    }
  };

  useEffect(() => {
    if (state.onboardingStep >= steps.length) {
      registerData();
      return;
    }

    const nextScreen = steps[state.onboardingStep];
    navigation.navigate(nextScreen);
  }, [state.onboardingStep, navigation]);

  // inside OnboardingNavigator component
  const isOnPaywall = () => {
    const getActiveRoute = (navState: any): string | null => {
      if (!navState) return null;
      const route = navState.routes?.[navState.index];
      if (!route) return null;
      // if it has nested state, recurse until we find the deepest active one
      return route.state ? getActiveRoute(route.state) : route.name;
    };

    const rootState = navigation.getState?.();
    const current = getActiveRoute(rootState);

    console.log('[isOnPaywall] current route:', current);
    return current === 'PayWall';
  };

  return (
    <>
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
        <OnboardingStack.Screen name="PayWall">
          {() => (
            <PaywallScreen
              onSuccess={entitlement => {
                if (!isOnPaywall()) {
                  console.log('[IAP] success received off-screen, ignoring');
                  return;
                }
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'entitlement',
                  value: entitlement,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={20}
              modal={false}
              totalSteps={steps.length}
            />
          )}
        </OnboardingStack.Screen>
        <OnboardingStack.Screen name="SignUp">
          {() => (
            <SignUpScreen
              onSave={(name, email, password) => {
                setAppleIdToken(null);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'name',
                  value: name,
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'email',
                  value: email,
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'password',
                  value: password,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onApple={(idToken, name, email) => {
                setAppleIdToken(idToken);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'name',
                  value: name,
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'email',
                  value: email,
                });
                dispatch({ type: 'NEXT_STEP' });
              }}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
              showProgressBar
              step={21}
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
