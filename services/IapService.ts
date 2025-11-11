import { iapApi } from '@api';
import { Entitlement, ValidateIOSPayload } from '@types';
import { Purchase } from 'expo-iap';
import * as SecureStore from 'expo-secure-store';

const ENTITLEMENT_KEY = 'fc_entitlement_v1';
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

// /** Public cache API */
// export const getEntitlementFromCache =
//   async (): Promise<Entitlement | null> => {
//     const raw = await secureGet(ENTITLEMENT_KEY);
//     if (!raw) return null;
//     try {
//       const ent = JSON.parse(raw) as Entitlement;
//       // Optional: auto-expire locally if past `expiresAtISO`
//       if (
//         ent.expiresAtISO &&
//         !isAfter(new Date(ent.expiresAtISO), new Date())
//       ) {
//         return { ...ent, active: false };
//       }
//       return ent;
//     } catch {
//       return null;
//     }
//   };
//
// export const clearEntitlementCache = async () => {
//   await secureDelete(ENTITLEMENT_KEY);
// };
//
// const saveEntitlement = async (ent: Entitlement) => {
//   await secureSet(ENTITLEMENT_KEY, JSON.stringify(ent));
// };

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

type ClientValidateArgs = { purchase: Purchase } | { kind: 'restore' }; // NE

export const validateIOSPurchaseClient = async (
  args: ClientValidateArgs
): Promise<
  { ok: true; entitlement?: Entitlement } | { ok: false; error?: string }
> => {
  console.log('hago llamada');
  // Handle restore path first
  if ('kind' in args && args.kind === 'restore') {
    return { ok: true }; // NEW: no-op until you add a backend restore route
  }

  // From here on, TS knows args has a 'purchase' field
  const { purchase } = args as {
    purchase: Purchase;
  }; // NEW

  try {
    const transactionId: string | undefined = purchase.id; // NEW
    if (!transactionId) {
      return { ok: false, error: 'Missing transactionId from purchase' }; // NEW
    }

    const payload: ValidateIOSPayload = {
      transactionId,
      // originalTransactionId: purchase?.originalTransactionId, // NEW
      productId: purchase?.productId,
    };

    const resp = await iapApi.validateIOS(payload); // NEW
    if (!resp?.ok || !resp?.entitlement) {
      return { ok: false, error: resp?.error || 'Server validation failed' }; // NEW
    }

    // await saveEntitlement(resp.entitlement); // NEW
    return { ok: true, entitlement: resp.entitlement }; // NEW
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Network error' }; // NEW
  }
};
