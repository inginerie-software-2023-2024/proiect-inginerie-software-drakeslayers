import { Socket } from 'socket.io-client';
import { RealtimeMessage } from '../chat/realtime-message.model';

interface ServerToClientEvents {
  any: (...args: any[]) => void;
  newChatMessage: (message: RealtimeMessage) => void;
}

interface ClientToServerEvents {
  any: (...args: any[]) => void;
}

export interface ChatSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
