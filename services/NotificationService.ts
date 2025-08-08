import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationsApi } from '@api';

/**
 * Asks the user for notification permissions and returns the Expo push token.
 */
export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  let token: string | null = null;
  console.log('arranco register');

  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    console.log('no tengo permiso');
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permission not granted for push notifications');
    return null;
  }

  const response = await Notifications.getExpoPushTokenAsync();
  token = response?.data;
  console.log('Expo Push Token:', token);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log('token', token);

  return token;
};

/**
 * Returns the Expo push token if notification permission is granted.
 * Does NOT trigger a permission prompt.
 */
export const getExpoPushTokenIfGranted = async (): Promise<string | null> => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  try {
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
    return expoPushToken;
  } catch (err) {
    console.warn('Error getting Expo push token:', err);
    return null;
  }
};

/**
 * Saves notification token to backend.
 */
export const saveNotificationToken = async (userId: string, token: string) => {
  try {
    await notificationsApi.saveExpoPushToken(userId, token);
  } catch (err) {
    console.log('Error saving push token to backend:', err);
  }
};
