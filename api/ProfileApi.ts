import { UserProfile } from '../types';
import { api } from './ApiInstance';

export const profileApi = {
  getProfile: async (id: string) =>
    api.post('/profile/get', { id }).then(response => response.data),
  updateUser: async (user: UserProfile) =>
    api.post('/profile/update', { user }).then(response => response.data),
  deleteUser: async (id: string) =>
    api.post('/profile/delete', { id }).then(response => response.data),
};
