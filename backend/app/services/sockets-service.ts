import { Socket } from 'socket.io';
import { CustomSocket } from '../utils/socket';

export class SocketsService {
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

}