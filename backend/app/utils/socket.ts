import { Socket } from 'socket.io';
import { FollowRequestNotification } from './notifications';

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

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
