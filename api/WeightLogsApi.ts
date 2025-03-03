import { WeightLogInterface } from '../types';
import { api } from './ApiInstance';

export const weightLogsApi = {
  getWeightLogs: async (userId: string): Promise<WeightLogInterface[]> =>
    api
      .post('/weight-logs/get', { user_id: userId })
      .then(response => response.data),
  deleteWeightLog: async (id: string) =>
    api.post('/weight-logs/delete', { id }).then(response => response.data),
};
