import { useAuth, useCurrentUser } from '@hooks';
import { useFocusEffect } from '@react-navigation/native';
import { PaywallScreen } from '@screens/shared';
import { updateProfile } from '@services';
import { Entitlement } from '@types';
import { useCallback } from 'react';

export const PayWallWrapper = ({ navigation }) => {
  const user = useCurrentUser();
  const { refreshUser } = useAuth();

  // Disable drawer swipe while Paywall is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      parent?.setOptions?.({ swipeEnabled: false });
      return () => parent?.setOptions?.({ swipeEnabled: true });
    }, [navigation])
  );

  const refresh = async (entitlement: Entitlement) => {
    console.log('get new entitlement on the wrapper', entitlement);
    try {
      const updated = { ...user, entitlement };
      await updateProfile(updated);
      console.log('entitlement saved in profile');
      await refreshUser(updated);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaywallScreen onSuccess={refresh} showProgressBar={false} modal={true} />
  );
};
