import { Socket } from 'socket.io';
import { FollowRequestNotification, NotificationRecipient, NotificationType } from '../utils/notifications';
import { CustomSocket } from '../utils/socket';
import { Follower, knexInstance } from '../utils/globals';
import { v4 as uuidv4 } from 'uuid';
import { craftError, errorCodes } from '../utils/error';
import { getProfileByUserId } from '../controllers/ProfileController';

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
}

export const notificationsService = new NotificationsService();
