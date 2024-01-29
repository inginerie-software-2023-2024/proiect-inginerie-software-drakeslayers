import { Socket } from 'socket.io-client';
import { NotificationWithData } from './notifications.model';

export interface ServerToClientEvents {
  any: (...args: any[]) => void;
  followRequestNotification: (content: NotificationWithData) => void;
  postLikeNotification: (content: NotificationWithData) => void;
  commentLikeNotification: (content: NotificationWithData) => void;
  newCommentNotification: (content: NotificationWithData) => void;
  newReplyNotification: (content: NotificationWithData) => void;
}

export interface ClientToServerEvents {
  any: (...args: any[]) => void;
}

export enum SocketTypeEnum {
  notifications = 'notifications',
  chat = 'chat'
}

export interface SocketAuth {
  userId: string | undefined;
  socketType: SocketTypeEnum
}

export interface ClientSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
