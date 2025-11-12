import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import { differenceInHours } from 'date-fns';
import { useAuth } from './Authcontext';
import { iapApi } from '@api';

// ✅ static imports (no dynamic import)
import { useIAP, getActiveSubscriptions } from 'expo-iap';

const LAST_CHECK_KEY = 'fc_last_sub_check_iso';
const MIN_HOURS_BETWEEN_CHECKS = 12;

export const SubscriptionWatcher = () => {
  const { user } = useAuth();
  const { connected } = useIAP(); // ✅ let the hook init/own the connection
  const appState = useRef<AppStateStatus>('active');
  const checkingRef = useRef(false);
  const navigation = useNavigation<any>();
  const navigatingRef = useRef(false);

  const isOnPaywall = () => {
    const state = navigation.getState?.();
    const route = state?.routes?.[state.index]?.name;
    return route === 'Paywall';
  };

  const showPayWall = () => {
    if (navigatingRef.current) return;
    if (isOnPaywall()) return;
    navigatingRef.current = true;
    // navigation.navigate('Home', { screen: 'Paywall' });
    navigation.navigate('Paywall');
  };

  const markChecked = async () => {
    try {
      await SecureStore.setItemAsync(LAST_CHECK_KEY, new Date().toISOString());
    } catch {
      console.log('failed markChecked SubscriptionWatcher');
    }
  };

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

  const runCheck = async (reason: 'startup' | 'foreground') => {
    console.log('running check because of:', reason);

    if (checkingRef.current) {
      console.log('is current check');
      return;
    }
    if (!(await shouldCheckNow())) {
      console.log('should not check yet');
      return;
    } else {
      console.log('checking');
    }

    // por si la cuenta tiene entitlement
    const grant = user?.entitlement?.grant;
    if (grant) {
      const stillValid =
        !grant.untilISO || new Date(grant.untilISO).getTime() > Date.now();
      if (stillValid) {
        await markChecked();
        console.log('[IAP] bypass via entitlement.grant:', grant.type);
        return;
      }
    }

    checkingRef.current = true;
    try {
      // 1) Local check only if the IAP connection is ready

      try {
        const activeSubs = await getActiveSubscriptions();
        console.log('[IAP] tiene estas subs: ', activeSubs);
        if (activeSubs) {
          const hasActive = activeSubs.some(s => s.isActive);
          console.log('[IAP] local active subs:', hasActive);
          if (hasActive) {
            await markChecked();
            return; // ✅ good locally; done
          }
        }
      } catch (err) {
        console.warn('[IAP] local check failed, will try server', err);
      }

      // 2) Fallback to your backend
      console.log('user', user);
      if (user?.entitlement?.originalTransactionId) {
        console.log(
          'chequeo que tenga enttitlements',
          user.entitlement.originalTransactionId
        );
        const respServerValidate = await iapApi.validateSubsStatus(
          user.entitlement.originalTransactionId
        );
        console.log('respuesta de entitlements', respServerValidate);
        await markChecked();
        if (respServerValidate.active === false) {
          console.log('entitlement no valido');
          Alert.alert(
            'Subscription expired',
            'Your subscription is not active',
            [{ text: 'OK', onPress: () => {} }]
          );
          showPayWall();
        } else {
          console.log('entitlement valido', respServerValidate.active);
        }
      } else {
        // No entitlement known → show paywall
        showPayWall();
      }
    } catch (e) {
      console.warn('SubscriptionWatcher check failed', e);
      // silent fail; next foreground will retry
    } finally {
      checkingRef.current = false;
    }
  };

  // When we return to Home (Drawer), allow future navigations again
  useEffect(() => {
    const unsub = navigation.addListener('state', () => {
      const state = navigation.getState?.();
      const route = state?.routes?.[state.index]?.name;
      if (route === 'Home') {
        navigatingRef.current = false; // ⬅️ reset guard
      }
    });
    return unsub;
  }, [navigation]);

  // Run once after mount (or when entitlement changes)
  useEffect(() => {
    console.log('mounting subs watcher. Connection to IAP is: ', connected);
    if (!connected) {
      console.log('[IAP] no conectado a IAP no puedo seguir');
      return;
    }
    runCheck('startup');
  }, [user?.entitlement?.originalTransactionId, connected]);

  // Run whenever app comes to foreground
  useEffect(() => {
    console.log('setting listener on sub watcher');
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
