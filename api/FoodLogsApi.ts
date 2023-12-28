import { api } from './ApiInstance';
import { FoodLog } from '../types';

export const foodLogsApi = {
  getFoodLogs: async (userId: string, date: Date): Promise<FoodLog[]> =>
    api
      .post('/food-logs/by-date', { userId, date })
      .then(response => response.data),
};
