import {
  createNativeStackNavigator,
  // NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { WeightGoalWrapper } from './WeighGoalWrapper';
import { ProfileScreen } from './ProfileScreen';
// import { EditCurrentWeightScreen } from './edit/EditCurrentWeightScreen';
// import { EditHeightScreen } from './edit/EditHeightScreen';
// import { EditBirthdateScreen } from './edit/EditBirthdateScreen';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  WeightGoalWrapper: undefined;
  EditCurrentWeight: undefined;
  EditHeight: undefined;
  EditBirthdate: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} />
    <Stack.Screen name="WeightGoalWrapper" component={WeightGoalWrapper} />
    {/* <Stack.Screen name="EditCurrentWeight" component={EditCurrentWeightScreen} /> */}
    {/* <Stack.Screen name="EditHeight" component={EditHeightScreen} /> */}
    {/* <Stack.Screen name="EditBirthdate" component={EditBirthdateScreen} /> */}
  </Stack.Navigator>
);
