import { profileApi } from '../api/ProfileApi';
import { User, UserProfile } from '../types';

export const updateProfile = async (user: UserProfile) => {
  const response = await profileApi.updateUser(user);
  return response;
};

export const getProfile = async (id: string): Promise<UserProfile> => {
  return profileApi.getProfile(id);
};
