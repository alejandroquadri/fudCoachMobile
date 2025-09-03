import { useCurrentUser } from '@hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GenderScreen } from '@screens/shared';
import { ProfileStackParamList } from './ProfileStack';
import { updateProfile } from '@services';

type Props = NativeStackScreenProps<ProfileStackParamList, 'GenderWrapper'>;

export const GenderWrapper = ({ navigation }: Props) => {
  const user = useCurrentUser();

  const saveGender = async (gender: string) => {
    try {
      const updated = { ...user, gender };
      await updateProfile(updated);
      navigation.goBack();
    } catch (err) {
      console.log('error updating', err);
    }
  };

  return (
    <GenderScreen
      initialValue={user.gender}
      onSave={saveGender}
      onBack={() => navigation.goBack()}
      standAlone={true}
    />
  );
};
