import { ValidateIOSPayload, ValidateResponse } from '@types';
import { api } from './ApiInstance';

export const iapApi = {
  validateIOS: async (payload: ValidateIOSPayload): Promise<ValidateResponse> =>
    api.post('/iap/validate-ios', { payload }).then(response => response.data),
};
