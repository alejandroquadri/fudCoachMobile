import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { useOnboarding } from './context/OnboardingContext';

import { useAuth } from '@hooks';
import {
  ActivityLevelScreen,
  BirthdateScreen,
  GenderScreen,
  HeightScreen,
  LifeStyleScreen,
  WeightScreen,
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
import { Alert } from 'react-native';
import { userAPI } from '@api/AuthApi';
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
  SignUp: undefined;
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

  const { signUp } = useAuth();

  const registerData = async () => {
    try {
      console.log('arranco register data', state);
      const { onboardingStep, ...userData } = state as {
        onboardingStep: number;
      } & UserProfile;

      const response = await userAPI.register(userData);
      console.log('response data', response);

      // Registro jobs de notifications
      // await createInitialNotificatinJobs(response.user._id);

      const token = response.token;
      const refreshToken = response.refreshToken;
      const profile = response.user;

      signUp(token, refreshToken, profile);
    } catch (error) {
      Alert.alert('Error', 'Failed Sign up');
    } finally {
      // TODO: posiblemente saco el loading
    }
  };

  useEffect(() => {
    if (state.onboardingStep >= steps.length) {
      registerData();
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
              console.log(nutritionGoals);
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
            onSave={(name, email, password) => {
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
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            showProgressBar
            step={20}
            totalSteps={steps.length}
          />
        )}
      </OnboardingStack.Screen>
    </OnboardingStack.Navigator>
  );
};
