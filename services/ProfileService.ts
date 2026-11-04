import { aiApi, profileApi } from '@api';
import { UserProfile } from '@types';

export const updateProfile = async (user: UserProfile) => {
  const profileData = { ...user };
  delete profileData.avatar;
  const profile = profileApi.updateUser(profileData);
  const state = aiApi.initPrefernces(profileData);
  const [profileRes] = await Promise.all([profile, state]);
  return profileRes;
};

export const getProfile = async (id: string): Promise<UserProfile> => {
  return profileApi.getProfile(id);
};

export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  return profileApi.deleteUser(id);
};
