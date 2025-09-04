import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BirthdateWrapper } from './BirthdateWrapper';
import { EditNameScreen } from './EditNameScreen';
import { GenderWrapper } from './GenderWrapper';
import { HeightWrapper } from './HeightWrapper';
import { ProfileScreen } from './ProfileScreen';
import { WeightGoalWrapper } from './WeighGoalWrapper';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  WeightGoalWrapper: undefined;
  HeightWrapper: undefined;
  BirthDateWrapper: undefined;
  GenderWrapper: undefined;
  EditNameScreen: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="WeightGoalWrapper" component={WeightGoalWrapper} />
    <Stack.Screen name="HeightWrapper" component={HeightWrapper} />
    <Stack.Screen name="BirthDateWrapper" component={BirthdateWrapper} />
    <Stack.Screen name="GenderWrapper" component={GenderWrapper} />
    <Stack.Screen name="EditNameScreen" component={EditNameScreen} />
  </Stack.Navigator>
);
