import { api } from './apiInstance';

export const aiApi = {
  test: () => api.get('/ai'),
};
