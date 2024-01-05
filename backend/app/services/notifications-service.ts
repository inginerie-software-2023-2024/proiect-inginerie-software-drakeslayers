import { Socket } from 'socket.io';
import { FollowRequestNotification } from '../utils/notifications';
import { CustomSocket } from '../utils/socket';

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

    public sendFollowRequestNotification(userId: string, notification: FollowRequestNotification): void {
        const socket = this.getSocket(userId);
        if (!!socket) {
            socket.emit('followRequestNotification', notification);
        }
    }
}

export const notificationsService = new NotificationsService();
