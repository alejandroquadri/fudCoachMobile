import { ChatMsg } from '../types';
import { api } from './ApiInstance';

export const aiApi = {
  aiResponse: async (message: string, userId: string): Promise<ChatMsg> =>
    api
      .post('/coach/get-answer', { message, userId })
      .then(response => response.data),
  parseImage: async (imageUri: string, userId: string): Promise<ChatMsg> => {
    const formData = new FormData();

    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg',
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
};
