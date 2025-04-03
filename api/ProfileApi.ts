import { api } from './ApiInstance';
import { User } from '../types';

export const profileApi = {
  updateUser: async (user: User) =>
    api.post('/profile/update', { user }).then(response => response.data),
};
