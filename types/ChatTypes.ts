export interface ChatMsg {
  userId?: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
}
