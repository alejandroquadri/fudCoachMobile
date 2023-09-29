import { api } from './ApiInstance';

export const userAPI = {
  loginEmailPass: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
  signUpEmailPass: (email: string, password: string, name: string) =>
    api.post('/users/signup', { email, password, name }),
};
