import { User } from '../types';
import { api } from './ApiInstance';

export const userAPI = {
  loginEmailPass: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
  signUpEmailPass: (
    email: string,
    password: string,
    name: string
  ): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> =>
    api
      .post('/users/signup', { email, password, name })
      .then(response => response.data),
  getProfile: (id: string): Promise<any> =>
    api.post('/users/getUserByID', { id }),
};
