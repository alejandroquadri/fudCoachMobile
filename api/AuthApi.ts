import { RegistrationData, User } from '../types';
import { api } from './ApiInstance';

export const userAPI = {
  loginEmailPass: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
  signUpEmailPass: (
    registrationData: RegistrationData
  ): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> =>
    api
      .post('/users/signup', { registrationData })
      .then(response => response.data),
  getProfile: (id: string): Promise<any> =>
    api.post('/users/getUserByID', { id }),
};
