import { api } from './ApiInstance';
import { User, UserProfile } from '../types';

export const profileApi = {
  getProfile: async (id: string) =>
    api.post('/profile/get', { id }).then(response => response.data),
  updateUser: async (user: UserProfile) =>
    api.post('/profile/update', { user }).then(response => response.data),
};
