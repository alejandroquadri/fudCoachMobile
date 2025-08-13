import { notificationsApi } from '@api';
import { NotificationTokenPayload } from '@types';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'fc_device_id';
const LAST_SENT_KEY = 'fc_last_push_token_payload';

export const ensurePushTokenSynced = async (
  userId: string,
  { requestIfDenied = false }: { requestIfDenied?: boolean } = {}
) => {
  let token = await getExpoPushTokenIfGranted();
  if (!token && requestIfDenied) {
    // Prompt once here if you want this call to be proactive
    token = await registerForPushNotificationsAsync();
  }
  if (!token) return;

  const platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';
  const rawAppId = Application.applicationId ?? undefined;
  const appId =
    rawAppId && rawAppId !== 'host.exp.Exponent' ? rawAppId : undefined;
  const deviceId = await getStableDeviceId();

  const payload: NotificationTokenPayload = {
    userId,
    token,
    platform,
    deviceId,
    appId,
  };

  const prevRaw = await SecureStore.getItemAsync(LAST_SENT_KEY);
  const prev: NotificationTokenPayload | null = prevRaw
    ? JSON.parse(prevRaw)
    : null;

  // Only send if something changed
  const changed =
    !prev ||
    prev.userId !== payload.userId ||
    prev.token !== payload.token ||
    prev.platform !== payload.platform ||
    prev.deviceId !== payload.deviceId ||
    prev.appId !== payload.appId;

  if (changed) {
    await notificationsApi.saveExpoPushToken(payload);
    await SecureStore.setItemAsync(LAST_SENT_KEY, JSON.stringify(payload));
  } else {
    console.log('no cambio');
  }
};

/**
 * Asks the user for notification permissions and returns the Expo push token.
 */
export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  let token: string | null = null;

  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    console.log('Requesting permission for push notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permission not granted for push notifications');
    return null;
  }

  const response = await Notifications.getExpoPushTokenAsync();
  token = response?.data;

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
    const platform: 'ios' | 'android' =
      Platform.OS === 'ios' ? 'ios' : 'android';

    // applicationId is your bundle identifier on iOS and package name on Android.
    // In Expo Go this can be "host.exp.Exponent"; if that’s not useful to you,
    // you can send undefined in that case.
    const rawAppId = Application.applicationId ?? undefined;
    const appId =
      rawAppId && rawAppId !== 'host.exp.Exponent' ? rawAppId : undefined;

    const deviceId = await getStableDeviceId();

    const tokenObj: NotificationTokenPayload = {
      userId,
      token,
      platform,
      deviceId,
      appId,
    };
    console.log(tokenObj);
    return notificationsApi.saveExpoPushToken(tokenObj);
  } catch (err) {
    console.log('Error saving push token to backend:', err);
  }
};

const getStableDeviceId = async (): Promise<string> => {
  try {
    if (Platform.OS === 'android') {
      // New API (SDK 50+)
      const id = Application.getAndroidId(); // returns string
      if (id) return id;
    } else if (Platform.OS === 'ios') {
      const idfv = await Application.getIosIdForVendorAsync(); // Promise<string | null>
      if (idfv) return idfv;
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: persist our own ID
  let cached = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!cached) {
    cached = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    await SecureStore.setItemAsync(DEVICE_ID_KEY, cached);
  }
  return cached;
};
