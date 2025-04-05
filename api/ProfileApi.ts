import { api } from './ApiInstance';
import { User } from '../types';

export const profileApi = {
  getProfile: async (id: string) =>
    api.post('/profile/get', { id }).then(response => response.data),
  updateUser: async (user: User) =>
    api.post('/profile/update', { user }).then(response => response.data),
};
