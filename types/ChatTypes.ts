export interface ChatMsg {
  userId?: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface AiState {
  messages: string[];
  preferences: Record<string, number | string | boolean>;
}
