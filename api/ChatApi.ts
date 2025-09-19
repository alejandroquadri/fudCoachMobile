import { ChatMsg } from '../types';
import { api } from './ApiInstance';

export const chatApi = {
  getMesgs: async (userId: string): Promise<ChatMsg[]> =>
    api.post('/chat/get-messages', { userId }).then(response => response.data),
};
