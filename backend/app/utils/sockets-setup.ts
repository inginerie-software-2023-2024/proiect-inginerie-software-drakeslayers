import https from 'https';
import { notificationsService } from '../services/notifications-service';
import { ClientToServerEvents, ServerToClientEvents } from './socket';
import { Server } from 'socket.io';
import { chatService } from '../services/chat-service';

const notificationsOnDisconnect = (userId: string) => notificationsService.getSocketsService().removeSocket(userId);
const chatOnDisconnect = (userId: string) => chatService.getSocketsService().removeSocket(userId);

export const setupSockets = (httpsServer: https.Server): void => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpsServer, {
        cors: {
            origin: 'https://localhost:4200',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        const socketType: string = socket.handshake.auth.socketType;
        const userId: string  = socket.handshake.auth.userId;

        switch (socketType){
            case 'notifications':
                notificationsService.getSocketsService().addSocket(userId, socket);
                socket.on('disconnect', () => notificationsOnDisconnect(userId));
                break;
            case 'chat':
                chatService.getSocketsService().addSocket(userId, socket);
                socket.on('disconnect', () => chatOnDisconnect(userId));
                break;
        }
    });

};
