import { Follower, Post, Profile } from './globals';

export enum NotificationType {
    FollowRequest = 'FollowRequest',
    NewFollower = 'NewFollower',
    PostLike = 'PostLike',
    CommentLike = 'CommentLike',
    NewComment = 'NewComment',
    NewReply = 'NewReply'
}

export interface Notification {
    id: string;
    createdAt: Date;
    userId: string;
    type: NotificationType;
    content: any | null;
}

export interface NotificationWithData {
    notification: Notification;
    profile: Profile; // Profile of the user who triggered the notification
}

export interface NotificationRecipient {
    notificationId: string;
    userId: string;
    readAt: Date | null;
}

export interface FollowRequestNotification extends Notification {
    content: Follower;
}

export interface NewFollowerNotification extends Notification {
    content: Follower;
}

export interface PostLikeNotification extends Notification {
    content: Post;
}

export interface CommentLikeNotification extends Notification {
    content: Post;
}

export interface NewCommentNotification extends Notification {
    content: Post;
}

export interface NewReplyNotification extends Notification {
    content: Post;
}