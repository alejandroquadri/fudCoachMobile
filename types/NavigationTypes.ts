export type RootStackParamList = {
  'Sign in': undefined;
  'Sign up': undefined;
  Registration: undefined;
  OnboardingProfile: undefined;
  Profile: { token: string; refreshToken: string } | undefined;
  LifeStyle: undefined;
  WeightGoal: undefined;
  Home: undefined;
  EditWeight: { onSave?: (newWeight: number) => void };
  EditHeight: { onSave?: (newHeight: number) => void };
  EditBirthdate: { onSave?: (date: string) => void };
  // define other screens here
};
