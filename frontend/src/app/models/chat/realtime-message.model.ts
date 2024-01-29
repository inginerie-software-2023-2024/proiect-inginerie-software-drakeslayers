import { ChatMessage } from "./chat-message.model";

export interface RealtimeMessage extends ChatMessage {
  chatId: string;
}
