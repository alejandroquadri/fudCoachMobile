import { DrawerToggleButton } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { HeightWrapper } from './HeightWrapper';
import { ProfileScreen } from './ProfileScreen';
import { WeightGoalWrapper } from './WeighGoalWrapper';
import { BirthdateWrapper } from './BirthdateWrapper';
import { GenderWrapper } from './GenderWrapper';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  WeightGoalWrapper: undefined;
  HeightWrapper: undefined;
  BirthDateWrapper: undefined;
  GenderWrapper?: undefined;
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
    <Stack.Screen name="BirthDateWrapper" component={BirthdateWrapper} />
    <Stack.Screen name="GenderWrapper" component={GenderWrapper} />
  </Stack.Navigator>
);
