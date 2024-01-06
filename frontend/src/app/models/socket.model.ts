import { Socket } from 'socket.io-client';
import { NotificationWithData } from './notifications.model';

export interface ServerToClientEvents {
  any: (...args: any[]) => void;
  followRequestNotification: (content: NotificationWithData) => void;
}

export interface ClientToServerEvents {
  any: (...args: any[]) => void;
}

export interface SocketAuth {
  userId: string | undefined;
}

export interface ClientSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
