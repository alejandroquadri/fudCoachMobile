import {
  SubscriptionStatus,
  ValidateIOSPayload,
  ValidateResponse,
} from '@types';
import { api } from './ApiInstance';

export const iapApi = {
  validateIOS: async (payload: ValidateIOSPayload): Promise<ValidateResponse> =>
    api.post('/iap/validate-ios', { payload }).then(response => response.data),
  validateSubsStatus: async (
    originalTransactionId: string
  ): Promise<SubscriptionStatus> =>
    api
      .post('/validate-subs-status', { originalTransactionId })
      .then(res => res.data),
};
