import { aiApi, profileApi } from '@api';
import { UserProfile } from '@types';

export const updateProfile = async (user: UserProfile) => {
  const profile = profileApi.updateUser(user);
  const state = aiApi.initPrefernces(user);
  const [profileRes, stateRes] = await Promise.all([profile, state]);
  return profileRes;
};

export const getProfile = async (id: string): Promise<UserProfile> => {
  return profileApi.getProfile(id);
};

export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  return profileApi.deleteUser(id);
};
