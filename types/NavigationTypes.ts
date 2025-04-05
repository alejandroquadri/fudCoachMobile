export type RootStackParamList = {
  'Sign in': undefined;
  'Sign up': undefined;
  Registration: undefined;
  OnboardingProfile: undefined;
  Profile: { token: string; refreshToken: string } | undefined;
  LifeStyle: undefined;
  WeightGoal: undefined;
  Home: undefined;
  EditWeight: { ocurrentWeight?: number; nSave?: (newWeight: number) => void };
  EditHeight: { currentHeight?: number; onSave?: (newHeight: number) => void };
  EditBirthdate: { currentBirthdate?: number; onSave?: (date: string) => void };
  // define other screens here
};
