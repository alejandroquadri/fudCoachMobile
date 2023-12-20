import { User } from '../types';
import { api } from './ApiInstance';

type newProfile = {
  name: string;
  birthdate: Date;
  weight: string;
  height: string;
  weightUnit: string;
  heightUnit: string;
  gender: string;
};

export const userAPI = {
  loginEmailPass: (email: string, password: string) =>
    api.post('/users/login', { email, password }),
  signUpEmailPass: (
    email: string,
    password: string,
    profile: newProfile
  ): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> =>
    api
      .post('/users/signup', { email, password, profile })
      .then(response => response.data),
  getProfile: (id: string): Promise<any> =>
    api.post('/users/getUserByID', { id }),
};
