import { Socket } from 'socket.io-client';
import { FollowRequestNotification } from './notifications.model';

export interface ServerToClientEvents {
  any: (...args: any[]) => void;
  followRequestNotification: (content: FollowRequestNotification) => void;
}

export interface ClientToServerEvents {
  any: (...args: any[]) => void;
}

export interface SocketAuth {
  userId: string | undefined;
}

export interface ClientSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
