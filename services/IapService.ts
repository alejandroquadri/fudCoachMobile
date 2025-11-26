import { iapApi } from '@api';
import { Entitlement, ValidateIOSPayload } from '@types';
import { ActiveSubscription, Purchase, PurchaseIOS } from 'expo-iap';
import * as SecureStore from 'expo-secure-store';

const ACCOUNT_TOKEN_KEY = 'fc_app_account_token_v1';

// /** Helpers backed by expo-secure-store */
const secureGet = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key, {
      keychainService: 'fudcoach.entitlements', // iOS keychain “service” namespace
    });
  } catch {
    return null;
  }
};

const secureSet = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainService: 'fudcoach.entitlements',
    });
  } catch (error) {
    console.log('error en secureSet', error);
  }
};

const secureDelete = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key, {
      keychainService: 'fudcoach.entitlements',
    });
  } catch (error) {
    console.log('error en secureDelete', error);
  }
};

/** ---------- Account token utilities ---------- */

// Simple UUID v4 generator without extra deps (sufficient for token use)
const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Persist a stable appAccountToken (StoreKit 2 association) // NEW
export const getOrCreateAppAccountToken = async (): Promise<string> => {
  const existing = await secureGet(ACCOUNT_TOKEN_KEY);
  if (existing) return existing;
  const token = uuidv4();
  await secureSet(ACCOUNT_TOKEN_KEY, token);
  return token;
};

export const validateIOSPurchaseSubscription = async (
  subscription: Purchase
): Promise<
  { ok: true; entitlement?: Entitlement } | { ok: false; error: string }
> => {
  console.log('[IAP service] Comientzo a validar subscription');
  try {
    const transactionId: string | undefined = subscription.id;
    if (!transactionId) {
      return { ok: false, error: 'Missing transactionId from purchase' };
    }

    const payload: ValidateIOSPayload = {
      transactionId,
      productId: subscription?.productId,
    };

    const resp = await iapApi.validateIOS(payload);
    if (!resp?.ok || !resp?.entitlement) {
      return { ok: false, error: resp?.error || 'Server validation failed' };
    }

    return { ok: true, entitlement: resp.entitlement };
  } catch (error) {
    return { ok: false, error: JSON.stringify(error) };
  }
};

export const validateIOSActiveSubscription = async (
  activeSubscription: ActiveSubscription
): Promise<
  { ok: true; entitlement?: Entitlement } | { ok: false; error: string }
> => {
  try {
    const transactionId: string | undefined = activeSubscription.transactionId;
    if (!transactionId) {
      return { ok: false, error: 'Missing transactionId from purchase' };
    }

    const payload: ValidateIOSPayload = {
      transactionId,
      productId: activeSubscription?.productId,
    };

    const resp = await iapApi.validateIOS(payload);
    if (!resp?.ok || !resp?.entitlement) {
      return { ok: false, error: resp?.error || 'Server validation failed' };
    }

    return { ok: true, entitlement: resp.entitlement };
  } catch (error) {
    return { ok: false, error: JSON.stringify(error) };
  }
};
