export type NotificationKey =
  | 'dailyPlanner'
  | 'lunchLogReminder'
  | 'dinnerLogReminder';

export interface NotificationTokenPayload {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
  deviceId?: string;
  appId?: string;
}

export interface CreateJobPayload {
  userId: string;
  key: NotificationKey;
  hourLocal: string; // "HH:mm"
  timezone: string; // IANA, required on create
  enabled: boolean; // default false
}

export interface UpdateJobPayload {
  userId: string;
  key: NotificationKey;
  enabled?: boolean; // optional
  hourLocal?: string; // optional "HH:mm"
  timezone?: string; // optional (change zone)
}
