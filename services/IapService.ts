import * as SecureStore from 'expo-secure-store';
import { addWeeks, addYears, isAfter } from 'date-fns';
import { Entitlement, ValidateIOSPayload, ValidateResponse } from '@types';
import { iapApi } from '@api';
import { Alert } from 'react-native';

const USE_MOCK = true;
const ENTITLEMENT_KEY = 'fc_entitlement_v1';

/** Helpers backed by expo-secure-store */
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

/** Public cache API */
export const getEntitlementFromCache =
  async (): Promise<Entitlement | null> => {
    const raw = await secureGet(ENTITLEMENT_KEY);
    if (!raw) return null;
    try {
      const ent = JSON.parse(raw) as Entitlement;
      // Optional: auto-expire locally if past `expiresAtISO`
      if (
        ent.expiresAtISO &&
        !isAfter(new Date(ent.expiresAtISO), new Date())
      ) {
        return { ...ent, active: false };
      }
      return ent;
    } catch {
      return null;
    }
  };

export const clearEntitlementCache = async () => {
  await secureDelete(ENTITLEMENT_KEY);
};

const saveEntitlement = async (ent: Entitlement) => {
  await secureSet(ENTITLEMENT_KEY, JSON.stringify(ent));
};

/** Mock “server” validation */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const validateIOS = async (
  req: ValidateIOSPayload
): Promise<ValidateResponse> => {
  if (USE_MOCK) {
    await delay(200);
    const now = new Date();
    const expiresAt =
      req.productId === 'weekly'
        ? addWeeks(now, 1)
        : req.productId === 'anual'
          ? addYears(now, 1)
          : undefined;

    const entitlement: Entitlement = {
      active: true,
      sku: req.productId,
      expiresAtISO: expiresAt?.toISOString(),
      environment: 'StoreKit',
    };
    await saveEntitlement(entitlement);
    return { ok: true, entitlement };
  }

  try {
    const res = await iapApi.validateIOS(req);
    if (res.ok && res.entitlement) {
      await saveEntitlement(res.entitlement);
    }
    return res;
  } catch (e) {
    console.log('validateIOS error', e);
    Alert.alert('Error', 'Could not validate purchase. Please try again.');
    return { ok: false, error: 'network' };
  }
};
