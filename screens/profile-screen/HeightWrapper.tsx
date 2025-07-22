import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './ProfileStack';
import { useCurrentUser } from '@navigation';
import { HeightScreen } from '../shared';
import { updateProfile } from '@services';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HeightWrapper'>;

export const HeightWrapper = ({ navigation }: Props) => {
  const user = useCurrentUser();

  const saveHeight = async ({
    height,
    unitType,
  }: {
    height: number;
    unitType: 'metric' | 'imperial';
  }) => {
    try {
      const updated = { ...user, height, unitType };
      await updateProfile(updated);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <HeightScreen
      initialValue={user.height}
      unitType={user.unitType}
      onSave={saveHeight}
      onBack={() => navigation.goBack()}
      standAlone={true}
    />
  );
};
