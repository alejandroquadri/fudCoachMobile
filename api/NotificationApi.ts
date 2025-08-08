import { api } from './ApiInstance';

export const notificationsApi = {
  saveExpoPushToken: async (userId: string, token: string): Promise<void> => {
    return api
      .post('/notifications/save-token', { userId, token })
      .then(res => res.data);
  },
};
