import { OnboardingState } from '@screens';
import { NutritionGoals, UserProfile } from '../types';
import { api } from './ApiInstance';

export const userAPI = {
  register: (
    user: UserProfile
  ): Promise<{
    user: UserProfile;
    token: string;
    refreshToken: string;
  }> => api.post('/users/register', { user }).then(response => response.data),

  loginEmailPass: (email: string, password: string) =>
    api
      .post('/users/login', { email, password })
      .then(response => response.data),

  loginApple: (
    idToken: string,
    userData?: Partial<UserProfile>
  ): Promise<{ user: UserProfile; token: string; refreshToken: string }> =>
    api
      .post('/users/login-apple', { idToken, userData })
      .then(response => response.data),

  getProfile: (id: string): Promise<UserProfile> =>
    api.post('/users/get-user-by-id', { id }).then(response => response.data),

  calculatePlan: (userData: OnboardingState): Promise<NutritionGoals> =>
    api
      .post('/users/calculate-plan', { userData })
      .then(response => response.data),
};
