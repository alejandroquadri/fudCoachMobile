import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FC } from 'react';

export type ProfileStackParamList = {
  Profile: undefined;
  EditBirthDate: undefined;
  EditHeight: undefined;
};
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: FC = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditBirthDate"
        component={EditBirthDate}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditHeight"
        component={EditHeight}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};
