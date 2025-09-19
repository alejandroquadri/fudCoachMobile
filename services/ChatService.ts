import { aiApi, chatApi } from '../api';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from 'react-native-gifted-chat';
import { AiState, ChatMsg, UserProfile } from '../types';
import * as ImageManipulator from 'expo-image-manipulator';

const PREUPLOAD_MAX = 1024; // longest side
const PREUPLOAD_QUALITY = 0.7; // 0..1

export const fetchPreviousMessages = async (
  userId: string
): Promise<IMessage[]> => {
  console.log('pido mensajes en service');
  const dbMes: ChatMsg[] = await chatApi.getMesgs(userId);
  console.log('obtengo mensajes');
  return buildIMessageArray(dbMes);
};

export const initUserPreferences = async (
  userProfile: UserProfile
): Promise<AiState> => {
  return aiApi.initPrefernces(userProfile);
};

export const sendChatMessage = async (
  message: string,
  userId: string
): Promise<IMessage> => {
  const aiResponse = await aiApi.aiResponse(message, userId);
  return buildIMessageArray([aiResponse])[0];
};

export const sendChatImage = async (
  imageUri: string,
  userId: string
): Promise<IMessage> => {
  const aiParsedImage = await aiApi.parseImage(imageUri, userId);
  return buildIMessageArray([aiParsedImage])[0];
};

const buildIMessageArray = (messages: ChatMsg[]): IMessage[] => {
  return messages.map(mes => ({
    _id: uuidv4(),
    text: mes.content,
    createdAt: new Date(mes.timestamp),
    // system: true, // esto sirve para que en lugar de aparecer en un globo aparezca como mensaje del sistema
    user: {
      _id: mes.sender === 'user' ? 1 : 2,
      name: mes.sender === 'user' ? 'User' : 'Food Coach', // You can replace 'User' with the actual user's name if available
    },
  }));
};

export const prepareForUpload = async (uri: string) => {
  // Resize by width; ImageManipulator preserves aspect ratio.
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: PREUPLOAD_MAX } }],
    {
      compress: PREUPLOAD_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG, // force JPEG (avoids HEIC issues)
      base64: false, // keep as file, not base64
    }
  );
  return result.uri; // local file:// URI to a smaller JPEG
};
