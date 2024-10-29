import { api } from './ApiInstance';
import { ExerciseLog, FoodLog, WaterLog } from '../types';

export const foodLogsApi = {
  getFoodLogs: async (userId: string, date: string): Promise<FoodLog[]> =>
    api
      .post('/food-logs/by-date', { user_id: userId, date })
      .then(response => response.data),
  getExerciseLogs: async (
    userId: string,
    date: string
  ): Promise<ExerciseLog[]> =>
    api
      .post('/exercise-logs/by-date', { user_id: userId, date })
      .then(response => response.data),
  getWaterLogs: async (userId: string, date: string): Promise<WaterLog> =>
    api
      .post('/water-logs/by-date', { user_id: userId, date })
      .then(response => response.data),
  upsertWaterLog: async (WaterLog: WaterLog) =>
    api
      .post('/water-logs/upsert', { waterLog: WaterLog })
      .then(response => response.data),
};
