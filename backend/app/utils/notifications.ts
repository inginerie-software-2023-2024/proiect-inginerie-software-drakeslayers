import { Follower } from './globals';

export enum NotificationType {
    FollowRequest = 'FollowRequest'
}

export interface Notification {
    type: NotificationType;
    content: any;
}

export interface FollowRequestNotification extends Notification {
    content: Follower;
}
