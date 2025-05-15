export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
};

export type DrawerParamList = {
  Chat: undefined;
  Profile: undefined;
  Goals: undefined;
  MealLogs: undefined;
  EditWeight: {
    onSave: (weightKg: number) => void;
  };
  EditHeight: {
    currentHeight?: number;
    onSave: (heightCm: number) => Promise<'ok' | undefined>;
  };
  EditBirthdate: {
    currentBirthdate: string | undefined;
    onSave: (date: string) => Promise<'ok' | undefined>;
  };
  EditGender: undefined;
};
