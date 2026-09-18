import type { NavigatorScreenParams } from '@react-navigation/native';
import type { OnboardingStackParamList } from '../screens/onboarding/OnboardingNavigator';

export type RootStackParamList = {
  App: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Paywall: undefined;
};

export type AppParamList = {
  Home: undefined;
  Paywall: undefined;
};

export type DrawerParamList = {
  Coach: undefined;
  Profile: undefined;
  ConfigStack: undefined;
  Progress: undefined;
  Logs: undefined;
  Paywall: undefined;
  Sources: undefined;
};
