import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegistrationProvider } from './RegistrationContext';
import {
  SignUp,
  CompleteProfileScreen,
  LifeStyleScreen,
  WeightGoalScreen,
} from '../screens';

export type RootStackParamList = {
  'Sign up': undefined;
  Profile: undefined;
  LifeStyle: undefined;
  WeightGoal: undefined;
  // define other screens here
};

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
          name="Profile"
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
