import { AiState, ChatMsg, UserProfile } from '../types';
import { api } from './ApiInstance';

export const aiApi = {
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
      // type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg',
      // type: mime.getType(imageUri) || 'image/jpeg',
    } as any); // cast as any to bypass typing issues in React Native

    formData.append('userId', userId);

    return api
      .post('/coach/parse-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => response.data);
  },
  initPrefernces: async (userProfile: UserProfile): Promise<AiState> => {
    return api
      .post('/coach/init-user-preferences', { userProfile })
      .then(response => response.data);
  },
};
