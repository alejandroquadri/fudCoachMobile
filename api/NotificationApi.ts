import { NotificationTokenPayload } from '@types';
import { api } from './ApiInstance';

export const notificationsApi = {
  saveExpoPushToken: async (
    notificationPayload: NotificationTokenPayload
  ): Promise<void> => {
    return api
      .post('/notifications/save-token', { notificationPayload })
      .then(res => res.data);
  },
};
