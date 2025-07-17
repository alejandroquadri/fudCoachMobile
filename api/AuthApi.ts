import { OnboardingState } from '@screens';
import { NutritionGoals, RegistrationData, User, UserProfile } from '../types';
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
  getProfile: (id: string): Promise<User> =>
    api.post('/users/getUserByID', { id }).then(response => response.data),
  calculatePlan: (userData: OnboardingState): Promise<NutritionGoals> =>
    api
      .post('/users/calculatePlan', { userData })
      .then(response => response.data),
  register: (
    user: UserProfile
  ): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> => api.post('/users/register', { user }).then(response => response.data),
};
