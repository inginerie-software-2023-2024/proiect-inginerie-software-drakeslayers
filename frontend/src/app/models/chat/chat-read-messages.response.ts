import { ChatMessage } from './chat-message.model';

export interface ChatReadMessagesResponse {
  lastRead: string;
  messages: ChatMessage[];
}
