import { Socket } from 'socket.io-client';
import { NotificationWithData } from '../notifications.model';

interface ServerToClientEvents {
  any: (...args: any[]) => void;
  followRequestNotification: (content: NotificationWithData) => void;
  newFollowerNotification: (content: NotificationWithData) => void;
  postLikeNotification: (content: NotificationWithData) => void;
  commentLikeNotification: (content: NotificationWithData) => void;
  newCommentNotification: (content: NotificationWithData) => void;
  newReplyNotification: (content: NotificationWithData) => void;
}

interface ClientToServerEvents {
  any: (...args: any[]) => void;
}

export interface NotificationSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {}
