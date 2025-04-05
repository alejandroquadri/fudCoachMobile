import { profileApi } from '../api/ProfileApi';
import { User } from '../types';

export const updateProfile = async (user: User) => {
  const response = await profileApi.updateUser(user);
  return response;
};

export const getProfile = async (id: string) => {
  return profileApi.getProfile(id);
};
