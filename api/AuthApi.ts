import { OnboardingState } from '@screens';
import { NutritionGoals, RegistrationUserInput, UserProfile } from '../types';
import { api } from './apiInstance';

export const userAPI = {
  register: (
    user: RegistrationUserInput
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
    register: boolean,
    userData?: Partial<RegistrationUserInput>
  ): Promise<{ user: UserProfile; token: string; refreshToken: string }> =>
    api
      .post('/users/login-apple', { idToken, userData, register })
      .then(response => response.data),

  calculatePlan: (userData: OnboardingState): Promise<NutritionGoals> =>
    api
      .post('/users/calculate-plan', { userData })
      .then(response => response.data),
};
