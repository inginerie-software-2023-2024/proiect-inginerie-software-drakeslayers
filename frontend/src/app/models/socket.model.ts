import { Socket } from 'socket.io-client';

export type AckCallback = (respone: { status: 'ok' | 'error'; message: string }) => void;

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  userConnected: (callback: AckCallback) => void;
  userDisconnected: (callback: AckCallback) => void;
}

export interface SocketAuth {
  userId: string | undefined;
}

export interface ClientSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
