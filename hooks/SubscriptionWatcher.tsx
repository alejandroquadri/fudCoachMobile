import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { differenceInHours } from 'date-fns';
import { useAuth } from './Authcontext';
import { iapApi } from '@api';
import { useNavigation } from '@react-navigation/native';

const LAST_CHECK_KEY = 'fc_last_sub_check_iso';
const MIN_HOURS_BETWEEN_CHECKS = 12;

export const SubscriptionWatcher = () => {
  const { user } = useAuth();
  const appState = useRef<AppStateStatus>('active');
  const checkingRef = useRef(false); // prevent overlapping calls
  const navigation = useNavigation<any>();
  const navigatingRef = useRef(false);

  // returns true if we never checked or if 12 hours have passed
  async function shouldCheckNow() {
    try {
      const lastISO = await SecureStore.getItemAsync(LAST_CHECK_KEY);
      if (!lastISO) return true;
      const hours = differenceInHours(new Date(), new Date(lastISO));
      return hours >= MIN_HOURS_BETWEEN_CHECKS;
    } catch {
      return true;
    }
  }

  const showPayWall = () => {
    // TODO: Show paywall
    console.log('showPayWall');
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigation.navigate('Home', { screen: 'Paywall' });
  };

  // records checked
  const markChecked = async () => {
    try {
      await SecureStore.setItemAsync(LAST_CHECK_KEY, new Date().toISOString());
    } catch {
      console.log('failed markChecked SubscriptionWatcher');
    }
  };

  const runCheck = async (reason: 'startup' | 'foreground') => {
    console.log('running check because of: ', reason);

    // If we have no entitlement info at all, send to paywall right away
    if (!user?.entitlement || !user.entitlement.originalTransactionId) {
      showPayWall();
      return;
    }

    if (checkingRef.current) return; // to make sure i am not checking just now
    if (!(await shouldCheckNow())) return;

    checkingRef.current = true;
    try {
      const ok = await iapApi.validateSubsStatus(
        user.entitlement.originalTransactionId
      );
      await markChecked();
      if (ok.active === false) {
        Alert.alert(
          'Subscription expired',
          'Your subscription is not active. Please subscribe again.',
          [{ text: 'OK', onPress: () => {} }]
        );
        showPayWall();
      }
    } catch (e) {
      // silent fail; we’ll try again next foreground
      // console.log('sub check failed', e);
    } finally {
      checkingRef.current = false;
    }
  };

  // 1) Run once after mount
  useEffect(() => {
    runCheck('startup');
  }, [user?.entitlement?.originalTransactionId]);

  // 2) Run whenever app comes to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        runCheck('foreground');
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  return null;
};
