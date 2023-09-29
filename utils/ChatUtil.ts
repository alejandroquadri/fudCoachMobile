import { IMessage } from 'react-native-gifted-chat';
import { v4 as uuidv4 } from 'uuid';
import { ChatMsg } from '../types';

export const buildIMessageArray = (
  messages: ChatMsg[],
  userName: string
): IMessage[] => {
  return messages.map(mes => ({
    _id: uuidv4(),
    text: mes.content,
    createdAt: new Date(mes.timestamp),
    user: {
      _id: mes.sender === 'user' ? 1 : 2,
      name: mes.sender === 'user' ? userName : 'Food Coach',
    },
  }));
};
