import { Follower } from './follower.model';
import { Post } from './post.model';
import { Profile } from './profile.model';

export enum NotificationType {
FollowRequest='FollowRequest',
NewFollower='NewFollower',
PostLike='PostLike',
CommentLike="CommentLike",
NewComment="NewComment",
NewReply="NewReply",
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

export interface NewFollowerNotification extends Notification {
  content: Follower;
}

export interface postLikeNotification extends Notification {
  content: Post;
}

export interface commentLikeNotification extends Notification {
  content: Post;
}

export interface newCommentNotification extends Notification {
  content: Post;
}

export interface newReplyNotification extends Notification {
  content: Post;
}
