import { Socket } from 'socket.io';
import { CommentLikeNotification, FollowRequestNotification, NewCommentNotification, NewReplyNotification, NotificationRecipient, NotificationType, PostLikeNotification } from '../utils/notifications';
import { CustomSocket } from '../utils/socket';
import { CommentLike, Follower, PostLike, Comment, knexInstance } from '../utils/globals';
import { v4 as uuidv4 } from 'uuid';
import { craftError, errorCodes } from '../utils/error';
import { getProfileByUserId } from '../controllers/ProfileController';
import { getPostById } from '../controllers/PostController';
import { getCommentPost } from '../controllers/CommentsController';

class NotificationsService {
    private readonly userSockets: Record<string, Socket> = {};

    constructor() {}

    public addSocket(userId: string, socket: Socket): void {
        this.userSockets[userId] = socket;
    }

    public removeSocket(userId: string): void {
        delete this.userSockets[userId];
    }

    public getSocket(userId: string): CustomSocket | undefined {
        return this.userSockets[userId];
    }

    public sendFollowRequestNotification(followedBy: string, follower: Follower): void {
        const notification: FollowRequestNotification = {
            id: uuidv4(),
            createdAt: new Date(),
            userId: followedBy,
            type: NotificationType.FollowRequest,
            content: follower
        };

        // First, save the notification in the database
        knexInstance
            .transaction((trx) =>
                trx('Notifications')
                    .insert(notification)
                    .then((arr) => {
                        if (arr.length === 0) {
                            throw {
                                error: craftError(errorCodes.other, 'Please try again!'),
                                content: undefined
                            };
                        } else {
                            const notificationRecipient: NotificationRecipient = {
                                notificationId: notification.id,
                                userId: follower.follows,
                                readAt: null
                            };

                            trx('NotificationRecipients')
                                .insert(notificationRecipient)
                                .then((arr) => {
                                    console.log('arr 2', arr.length);
                                    if (arr.length === 0) {
                                        throw {
                                            error: craftError(errorCodes.other, 'Please try again!'),
                                            content: undefined
                                        };
                                    }
                                });
                        }
                    })
            )
            .then(() => {
                // Then, send the notification to the user
                getProfileByUserId(follower.followedBy).then((followerProfile) => {
                    const socket = this.getSocket(follower.follows);
                    if (!!socket && !!followerProfile) {
                        socket.emit('followRequestNotification', { notification, profile: followerProfile });
                    }
                });
            });
    }

    public sendPostLikeNotification(postLike: PostLike): void {
        getPostById(postLike.postId)
            .then(post => {
                const notification: PostLikeNotification = {
                    id: uuidv4(),
                    createdAt: new Date(),
                    userId: postLike.userId,
                    type: NotificationType.PostLike,
                    content: post,
                };
                // First, save the notification in the database
                knexInstance
                .transaction((trx) =>
                    trx('Notifications')
                        .insert(notification)
                        .then((arr) => {
                            if (arr.length === 0) {
                                throw {
                                    error: craftError(errorCodes.other, 'Please try again!'),
                                    content: undefined
                                };
                            } else {
                                const notificationRecipient: NotificationRecipient = {
                                    notificationId: notification.id,
                                    userId: post.userId,
                                    readAt: null
                                };

                                trx('NotificationRecipients')
                                    .insert(notificationRecipient)
                                    .then((arr) => {
                                        console.log('arr 2', arr.length);
                                        if (arr.length === 0) {
                                            throw {
                                                error: craftError(errorCodes.other, 'Please try again!'),
                                                content: undefined
                                            };
                                        }
                                    });
                            }
                        })
                )
                .then(() => {
                    // Then, send the notification to the user
                    getProfileByUserId(postLike.userId).then((userProfile) => {
                        const socket = this.getSocket(post.userId);
                        if (!!socket && !!userProfile) {
                            socket.emit('postLikeNotification', { notification, profile: userProfile });
                        }
                    });
                });
            })
    }

    public sendCommentLikeNotification(commentLike: CommentLike): void {
        getCommentPost(commentLike.commentId)
            .then(x => {
                const { commentOwnerId, ...post } = x;
                if (commentOwnerId == commentLike.userId) {
                    return;
                }
                const notification: CommentLikeNotification = {
                    id: uuidv4(),
                    createdAt: new Date(),
                    userId: commentLike.userId,
                    type: NotificationType.CommentLike,
                    content: post
                };
                // First, save the notification in the database
                knexInstance
                .transaction((trx) =>
                    trx('Notifications')
                        .insert(notification)
                        .then((arr) => {
                            if (arr.length === 0) {
                                throw {
                                    error: craftError(errorCodes.other, 'Please try again!'),
                                    content: undefined
                                };
                            } else {
                                const notificationRecipient: NotificationRecipient = {
                                    notificationId: notification.id,
                                    userId: commentOwnerId,
                                    readAt: null
                                };

                                trx('NotificationRecipients')
                                    .insert(notificationRecipient)
                                    .then((arr) => {
                                        console.log('arr 2', arr.length);
                                        if (arr.length === 0) {
                                            throw {
                                                error: craftError(errorCodes.other, 'Please try again!'),
                                                content: undefined
                                            };
                                        }
                                    });
                            }
                        })
                )
                .then(() => {
                    // Then, send the notification to the user
                    getProfileByUserId(commentLike.userId).then((userProfile) => {
                        const socket = this.getSocket(commentOwnerId);
                        if (!!socket && !!userProfile) {
                            socket.emit('postLikeNotification', { notification, profile: userProfile });
                        }
                    });
                });
            })
    }

    public sendNewCommentNotification(comment: Comment): void {
        getCommentPost(comment.id)
            .then(post => {
                if (comment.userId == post.userId) { // User commented on his post
                    return;
                }
                const notification: NewCommentNotification = {
                    id: uuidv4(),
                    createdAt: new Date(),
                    userId: comment.userId,
                    type: NotificationType.NewComment,
                    content: post
                };
                // First, save the notification in the database
                knexInstance
                .transaction((trx) =>
                    trx('Notifications')
                        .insert(notification)
                        .then((arr) => {
                            if (arr.length === 0) {
                                throw {
                                    error: craftError(errorCodes.other, 'Please try again!'),
                                    content: undefined
                                };
                            } else {
                                const notificationRecipient: NotificationRecipient = {
                                    notificationId: notification.id,
                                    userId: post.userId,
                                    readAt: null
                                };

                                trx('NotificationRecipients')
                                    .insert(notificationRecipient)
                                    .then((arr) => {
                                        console.log('arr 2', arr.length);
                                        if (arr.length === 0) {
                                            throw {
                                                error: craftError(errorCodes.other, 'Please try again!'),
                                                content: undefined
                                            };
                                        }
                                    });
                            }
                        })
                )
                .then(() => {
                    // Then, send the notification to the user
                    getProfileByUserId(comment.userId).then((userProfile) => {
                        const socket = this.getSocket(post.userId);
                        if (!!socket && !!userProfile) {
                            socket.emit('newCommentNotification', { notification, profile: userProfile });
                        }
                    }); 
                });
            })
    }

    public sendNewReplyNotification(comment: Comment, commentAuthorId: string): void {
        if (comment.userId == commentAuthorId) {
            return;
        }
        getCommentPost(comment.id)
            .then(post => {
                const notification: NewReplyNotification = {
                    id: uuidv4(),
                    createdAt: new Date(),
                    userId: comment.userId,
                    type: NotificationType.NewReply,
                    content: post
                };
                // First, save the notification in the database
                knexInstance
                .transaction((trx) =>
                    trx('Notifications')
                        .insert(notification)
                        .then((arr) => {
                            if (arr.length === 0) {
                                throw {
                                    error: craftError(errorCodes.other, 'Please try again!'),
                                    content: undefined
                                };
                            } else {
                                const notificationRecipient: NotificationRecipient = {
                                    notificationId: notification.id,
                                    userId: commentAuthorId,
                                    readAt: null
                                };

                                trx('NotificationRecipients')
                                    .insert(notificationRecipient)
                                    .then((arr) => {
                                        console.log('arr 2', arr.length);
                                        if (arr.length === 0) {
                                            throw {
                                                error: craftError(errorCodes.other, 'Please try again!'),
                                                content: undefined
                                            };
                                        }
                                    });
                            }
                        })
                )
                .then(() => {
                    // Then, send the notification to the user
                    getProfileByUserId(comment.userId).then((userProfile) => {
                        const socket = this.getSocket(commentAuthorId);
                        if (!!socket && !!userProfile) {
                            socket.emit('newReplyNotification', { notification, profile: userProfile });
                        }
                    }); 
                });
            })
    }
}

export const notificationsService = new NotificationsService();
