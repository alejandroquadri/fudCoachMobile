import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext, AuthContextType } from '@navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateProfile } from '@services';
import { ProfileStackParamList } from './ProfileStack';
import { WeightScreen } from '../shared';

type Props = NativeStackScreenProps<ProfileStackParamList, 'WeightGoalWrapper'>;

export const WeightGoalWrapper: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { user, refreshUser } = useContext(AuthContext) as AuthContextType;
  if (user === null) {
    throw new Error('User not found');
  }

  const saveWeight = async ({
    weight,
    unitType,
  }: {
    weight: number;
    unitType: 'metric' | 'imperial';
  }) => {
    try {
      const updated = { ...user, weightGoal: weight, unitType };
      await updateProfile(updated);
      refreshUser(updated);
      navigation.goBack(); // previous screen auto-refreshes
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <WeightScreen
      initialValue={user.weightGoal}
      unitType={user.unitType}
      title="Set your goal weight"
      onSave={saveWeight}
      onBack={() => navigation.goBack()}
    />
  );
};
