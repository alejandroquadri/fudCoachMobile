import { iapApi } from '@api';
import { Entitlement, ValidateIOSPayload, ValidateResponse } from '@types';
import { Purchase } from 'expo-iap';

export const validateIOSPurchaseSubscription = async (
  subscription: Purchase
): Promise<
  { ok: true; entitlement: Entitlement } | { ok: false; error: string }
> => {
  const transactionId: string | undefined = subscription.id;
  if (!transactionId) {
    return { ok: false, error: 'Missing transactionId from purchase' };
  }

  const payload: ValidateIOSPayload = { transactionId };

  const resp = await iapApi.validateIOS(payload);
  if (!resp?.ok || !resp?.entitlement?.active) {
    return { ok: false, error: resp?.error || 'Server validation failed' };
  }

  return { ok: true, entitlement: resp.entitlement };
};

export const getIOSSubscriptionEntitlement =
  async (): Promise<ValidateResponse> => iapApi.getEntitlement();
