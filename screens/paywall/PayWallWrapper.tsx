import { useAuth } from '@hooks';
import { PaywallScreen } from '@screens/shared';
import { getProfile } from '@services';

export const PayWallWrapper = () => {
  const { user, refreshUser } = useAuth();

  if (!user) {
    console.log('[PayWallWrapper] No user in context yet');
    return null; // prevents crash
  }

  const refresh = async () => {
    try {
      const freshUser = await getProfile(user._id);
      await refreshUser(freshUser);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaywallScreen onSuccess={refresh} showProgressBar={false} modal={true} />
  );
};
