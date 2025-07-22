import { useCurrentUser } from '@navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { updateProfile } from '@services';
import { ProfileStackParamList } from './ProfileStack';
import { WeightScreen } from '../shared';

type Props = NativeStackScreenProps<ProfileStackParamList, 'WeightGoalWrapper'>;

export const WeightGoalWrapper = ({ navigation }: Props) => {
  const user = useCurrentUser();
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
      standAlone={true}
    />
  );
};
