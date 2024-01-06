import { Follower } from './globals';

export enum NotificationType {
    FollowRequest = 'FollowRequest'
}

export interface Notification {
    id: string;
    createdAt: Date;
    userId: string;
    type: NotificationType;
    content: any | null;
}

export interface NotificationRecipient {
    notificationId: string;
    userId: string;
    readAt: Date | null;
}

export interface FollowRequestNotification extends Notification {
    content: Follower;
}
