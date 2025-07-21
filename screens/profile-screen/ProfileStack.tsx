import { DrawerToggleButton } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeightWrapper } from './HeightWrapper';
import { ProfileScreen } from './ProfileScreen';
import { WeightGoalWrapper } from './WeighGoalWrapper';
import { View } from 'react-native';
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
    <Stack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{
        headerShown: true,
        title: 'Profile',
        headerLeft: () => (
          <View style={{ marginLeft: -18 }}>
            {/* tweak -8 / -12 until it lines up */}
            <DrawerToggleButton />
          </View>
        ),
      }}
    />
    <Stack.Screen name="WeightGoalWrapper" component={WeightGoalWrapper} />
    <Stack.Screen name="HeightWrapper" component={HeightWrapper} />
    {/* <Stack.Screen name="EditBirthdate" component={EditBirthdateScreen} /> */}
  </Stack.Navigator>
);
