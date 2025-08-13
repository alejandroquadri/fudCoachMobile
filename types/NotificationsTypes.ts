export interface NotificationTokenPayload {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
  deviceId?: string;
  appId?: string;
}
