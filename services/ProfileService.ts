import { profileApi } from '../api/ProfileApi';
import { User } from '../types';

export const updateProfile = async (user: User) => {
  const response = await profileApi.updateUser(user);
  return response;
};
