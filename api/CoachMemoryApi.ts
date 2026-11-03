import { api } from './apiInstance';

export interface CoachMemory {
  goals: string;
  relationships: string;
  preferences: string;
  context: string;
  revision: number;
  updatedAt: string | null;
  contextResetAt: string | null;
}
export const coachMemoryApi = {
  get: async (): Promise<CoachMemory> =>
    (await api.get('/profile/memory')).data,
  save: async (
    memory: Omit<CoachMemory, 'updatedAt' | 'contextResetAt'>
  ): Promise<CoachMemory> => (await api.put('/profile/memory', memory)).data,
};
