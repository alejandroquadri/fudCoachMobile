import {
  CreateJobPayload,
  NotificationKey,
  NotificationTokenPayload,
  UpdateJobPayload,
} from '@types';
import { api } from './ApiInstance';

export const notificationsApi = {
  saveExpoPushToken: async (
    notificationPayload: NotificationTokenPayload
  ): Promise<void> => {
    return api
      .post('/notifications/save-token', { notificationPayload })
      .then(res => res.data);
  },
  createNotificationJob: async (
    payload: CreateJobPayload
  ): Promise<{
    ok: boolean;
    userId: string;
    key: NotificationKey;
    enabled: boolean;
    hourLocal: string;
    timezone: string;
  }> => {
    return api
      .post('/notifications/create-not-job', payload)
      .then(res => res.data);
  },
  updateNotificationJob: async (
    payload: UpdateJobPayload
  ): Promise<{
    ok: boolean;
    userId: string;
    key: NotificationKey;
    enabled: boolean;
    hourLocal: string;
    timezone: string;
  }> => {
    return api
      .post('/notifications/update-not-job', payload)
      .then(res => res.data);
  },
};
