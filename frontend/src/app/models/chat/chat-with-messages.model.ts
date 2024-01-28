import { ChatMessage } from "./chat-message.model";
import { Chat } from "./chat.model";

export interface ChatWithMessages {
  chat: Chat;
  messages: ChatMessage[];
  lastRead: string;
}
