import { AiState, ChatMsg, UserProfile } from '../types';
import { api } from './ApiInstance';

export const aiApi = {
  initPrefernces: async (userProfile: UserProfile): Promise<AiState> => {
    return api
      .post('/coach/init-user-preferences', { userProfile })
      .then(response => response.data);
  },
  getWelcomeMes: async (userId: string): Promise<ChatMsg> =>
    api.post('/coach/get-welcome', { userId }).then(response => response.data),
  markWelcomeDelivered: async (userId: string): Promise<void> =>
    api.post('/coach/mark-welcome-delivered', { userId }).then(),
  getMesgs: async (userId: string): Promise<ChatMsg[]> =>
    api.post('/coach/get-messages', { userId }).then(response => response.data),
  aiResponse: async (message: string, userId: string): Promise<ChatMsg> =>
    api
      .post('/coach/get-answer', { message, userId })
      .then(response => response.data),
  parseImage: async (uri: string, userId: string): Promise<ChatMsg> => {
    const formData = new FormData();

    formData.append('image', {
      uri,
      name: `photo_${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);

    formData.append('userId', userId);

    return api
      .post('/coach/parse-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data);
  },
};
