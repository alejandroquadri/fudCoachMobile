import { ChatMsg } from '../types';
import { api } from './apiInstance';

export const aiApi = {
  aiResponse: (
    token: string,
    message: string,
    userId: string
  ): Promise<ChatMsg> =>
    api
      .post(
        '/coach/getAnswer',
        { message, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => response.data),
};
