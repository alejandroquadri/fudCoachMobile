import { profileApi } from '@api';
import { UserProfile } from '@types';

export const updateProfile = async (user: UserProfile) => {
  const response = await profileApi.updateUser(user);
  return response;
};

export const getProfile = async (id: string): Promise<UserProfile> => {
  return profileApi.getProfile(id);
};
