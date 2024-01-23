import https from 'https';
import { notificationsService } from '../services/notifications-service';
import { ClientToServerEvents, ServerToClientEvents } from './socket';
import { Server } from 'socket.io';

export const setupSockets = (httpsServer: https.Server): void => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpsServer, {
        cors: {
            origin: 'https://localhost:4200',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        notificationsService.getSocketsService().addSocket(socket.handshake.auth.userId, socket);

        socket.on('disconnect', () => {
            notificationsService.getSocketsService().removeSocket(socket.handshake.auth.userId);
        });
    });
};
