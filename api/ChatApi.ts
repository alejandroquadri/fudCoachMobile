import { ChatMsg } from '../types';
import { api } from './ApiInstance';

export const chatApi = {
  getMesgs: async (userId: string): Promise<ChatMsg[]> =>
    api.post('/chat/getMessages', { userId }).then(response => response.data),
};
