import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth, useCurrentUser } from '@hooks';
import { useFocusEffect } from '@react-navigation/native';
import { PaywallScreen } from '@screens/shared';
import { updateProfile } from '@services';
import { AppParamList, Entitlement } from '@types';
import { useCallback } from 'react';

type Props = NativeStackScreenProps<AppParamList, 'Paywall'>;

export const PayWallWrapper = ({ navigation }: Props) => {
  const user = useCurrentUser();
  const { refreshUser } = useAuth();

  // Disable drawer swipe while Paywall is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     const parent = navigation.getParent?.();
  //     parent?.setOptions?.({ swipeEnabled: false });
  //     return () => parent?.setOptions?.({ swipeEnabled: true });
  //   }, [navigation])
  // );

  const refresh = async (entitlement: Entitlement) => {
    console.log('get new entitlement on the wrapper', entitlement);
    try {
      const updated = { ...user, entitlement };
      await updateProfile(updated);
      console.log('entitlement saved in profile');
      await refreshUser(updated);
      // navigation.goBack();
      navigation.replace('Home');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaywallScreen onSuccess={refresh} showProgressBar={false} modal={true} />
  );
};
