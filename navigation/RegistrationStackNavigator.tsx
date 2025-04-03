import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegistrationProvider } from './RegistrationContext';
import {
  SignUp,
  CompleteProfileScreen,
  LifeStyleScreen,
  WeightGoalScreen,
} from '../screens';
import { RootStackParamList } from '../types';

const RegistrationStack = createNativeStackNavigator<RootStackParamList>();

export const RegistrationStackNavigator = () => {
  return (
    <RegistrationProvider>
      <RegistrationStack.Navigator>
        <RegistrationStack.Screen
          name="Sign up"
          component={SignUp}
          options={{ headerShown: true }}
        />
        <RegistrationStack.Screen
          name="OnboardingProfile"
          component={CompleteProfileScreen}
        />
        <RegistrationStack.Screen
          name="LifeStyle"
          component={LifeStyleScreen}
        />
        <RegistrationStack.Screen
          name="WeightGoal"
          component={WeightGoalScreen}
        />
      </RegistrationStack.Navigator>
    </RegistrationProvider>
  );
};
