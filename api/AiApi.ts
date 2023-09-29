import { ChatMsg } from '../types';
import { api } from './ApiInstance';

export const aiApi = {
  aiResponse: async (message: string, userId: string): Promise<ChatMsg> =>
    api
      .post('/coach/getAnswer', { message, userId })
      .then(response => response.data),
};
