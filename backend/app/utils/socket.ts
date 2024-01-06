import { Socket } from 'socket.io';
import { NotificationWithData } from './notifications';

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

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
