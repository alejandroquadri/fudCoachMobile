import { useCurrentUser } from '@hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BirthdateScreen } from '@screens/shared';
import { updateProfile } from '@services';
import { ProfileStackParamList } from './ProfileStack';

type Props = NativeStackScreenProps<ProfileStackParamList, 'BirthDateWrapper'>;

export const BirthdateWrapper = ({ navigation }: Props) => {
  const user = useCurrentUser();

  const saveBirthdate = async (birthdate: string) => {
    try {
      const updated = { ...user, birthdate };
      await updateProfile(updated);
      navigation.goBack();
    } catch (e) {
      console.log('error updating birthdate:', e);
    }
  };

  return (
    <BirthdateScreen
      initialValue={user.birthdate}
      onSave={saveBirthdate}
      onBack={() => navigation.goBack()}
      standAlone={true}
    />
  );
};
