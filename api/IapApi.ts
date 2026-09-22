import { ValidateIOSPayload, ValidateResponse } from '@types';
import { api } from './apiInstance';

export const iapApi = {
  validateIOS: async (payload: ValidateIOSPayload): Promise<ValidateResponse> =>
    api.post('/iap/validate-ios', { payload }).then(response => response.data),
  getEntitlement: async (): Promise<ValidateResponse> =>
    api.get('/iap/entitlement').then(response => response.data),
};
