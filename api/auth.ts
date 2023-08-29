import { api } from './apiInstance';
import * as SecureStore from 'expo-secure-store';

export const userAPI = {
  loginEmailPass: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
  signUpEmailPass: (email: string, password: string, name: string) =>
    api.post('/users/signup', { email, password, name }),
};

api.interceptors.request.use(
  async config => {
    // Check if the URL contains 'ai' before attaching the token
    if (config.url && !config.url.includes('/users')) {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
