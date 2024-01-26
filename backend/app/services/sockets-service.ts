import { Socket } from 'socket.io';

export class SocketsService {
    private readonly userSockets: Record<string, Socket> = {};

    constructor() {}

    public addSocket(userId: string, socket: Socket): void {
        this.userSockets[userId] = socket;
    }

    public removeSocket(userId: string): void {
        delete this.userSockets[userId];
    }

    public getSocket(userId: string): Socket | undefined {
        return this.userSockets[userId];
    }

}