export interface ChatMsg {
  messageId?: string;
  turnId?: string;
  userId?: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface AiState {
  messages: string[];
  preferences: Record<string, number | string | boolean>;
}
