import { Follower } from './follower.model';
import { Profile } from './profile.model';

export enum NotificationType {
  FollowRequest = 'FollowRequest'
}

export interface Notification {
  id: string;
  createdAt: string;
  userId: string;
  type: NotificationType;
  content: any | null;
}

export interface NotificationWithData {
  notification: Notification;
  profile: Profile; // Profile of the user who triggered the notification
}

export interface FollowRequestNotification extends Notification {
  content: Follower;
}
