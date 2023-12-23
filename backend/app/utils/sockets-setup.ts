import https from 'https';
import { NotificationsService } from '../services/notifications-service';
import { ClientToServerEvents, ServerToClientEvents } from './socket';
import { Server } from 'socket.io';

export const setupSockets = (httpsServer: https.Server): void => {
    const notificationsService = new NotificationsService();
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpsServer, {
        cors: {
            origin: 'https://localhost:4200'
        }
    });

    io.on('connection', (socket) => {
        notificationsService.addSocket(socket.handshake.auth.userId, socket);

        socket.on('disconnect', () => {
            notificationsService.removeSocket(socket.handshake.auth.userId);
        });
    });
};
