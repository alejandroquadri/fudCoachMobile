import {
  createNativeStackNavigator,
  // NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { WeightGoalWrapper } from './WeighGoalWrapper';
import { ProfileScreen } from './ProfileScreen';
import { HeightWrapper } from './HeightWrapper';
// import { EditCurrentWeightScreen } from './edit/EditCurrentWeightScreen';
// import { EditBirthdateScreen } from './edit/EditBirthdateScreen';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  WeightGoalWrapper: undefined;
  HeightWrapper: undefined;
  EditBirthdate: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="WeightGoalWrapper" component={WeightGoalWrapper} />
    <Stack.Screen name="HeightWrapper" component={HeightWrapper} />
    {/* <Stack.Screen name="EditBirthdate" component={EditBirthdateScreen} /> */}
  </Stack.Navigator>
);
