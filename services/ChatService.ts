import { aiApi, chatApi } from '../api';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from 'react-native-gifted-chat';
import { ChatMsg } from '../types';

export const fetchPreviousMessages = async (
  userId: string
): Promise<IMessage[]> => {
  const dbMes: ChatMsg[] = await chatApi.getMesgs(userId);
  return buildIMessageArray(dbMes);
};

export const sendChatMessage = async (
  message: string,
  userId: string
): Promise<IMessage> => {
  const aiResponse = await aiApi.aiResponse(message, userId);
  return buildIMessageArray([aiResponse])[0];
};

const buildIMessageArray = (messages: ChatMsg[]): IMessage[] => {
  return messages.map(mes => ({
    _id: uuidv4(),
    text: mes.content,
    createdAt: new Date(mes.timestamp),
    user: {
      _id: mes.sender === 'user' ? 1 : 2,
      name: mes.sender === 'user' ? 'User' : 'Food Coach', // You can replace 'User' with the actual user's name if available
    },
  }));
};
