import { userAPI } from '@api';
import { UserProfile } from '@types';
import { Alert } from 'react-native';

type AppleLoginResponse = {
  token: string;
  refreshToken: string;
  user: UserProfile;
};

const isValidAppleLoginResponse = (
  data: AppleLoginResponse
): data is AppleLoginResponse => {
  return (
    data &&
    typeof data.token === 'string' &&
    typeof data.refreshToken === 'string' &&
    data.user &&
    typeof data.user === 'object'
  );
};

export const appleLogin = async (
  credential: string,
  register: boolean,
  userData: Partial<UserProfile>
): Promise<{
  token: string;
  refreshToken: string;
  user: UserProfile;
} | void> => {
  try {
    const result = await userAPI.loginApple(credential, register, userData);

    //  Validate backend payload before using it
    if (!isValidAppleLoginResponse(result)) {
      console.error('Unexpected Apple login response', result);
      throw new Error(result);
    }
    const { token, refreshToken, user } = result;
    return { token, refreshToken, user };
  } catch (e: any) {
    if (e?.code === 'ERR_REQUEST_CANCELED') return; // user canceled
    Alert.alert('Apple Sign In failed', 'Please try again.');
  }
};
