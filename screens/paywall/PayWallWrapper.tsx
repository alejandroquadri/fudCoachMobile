import { useAuth, useSubscription } from '@hooks';
import { PaywallScreen } from '@screens/shared';
import { updateProfile } from '@services';
import { Entitlement } from '@types';

export const PayWallWrapper = () => {
  const { user, refreshUser } = useAuth();

  if (!user) {
    console.log('[PayWallWrapper] No user in context yet');
    return null; // prevents crash
  }

  const refresh = async (entitlement: Entitlement) => {
    console.log('get new entitlement on the wrapper', entitlement);
    try {
      const updated = { ...user, entitlement };
      await updateProfile(updated);
      console.log('entitlement saved in profile');
      await refreshUser(updated);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaywallScreen onSuccess={refresh} showProgressBar={false} modal={true} />
  );
};
