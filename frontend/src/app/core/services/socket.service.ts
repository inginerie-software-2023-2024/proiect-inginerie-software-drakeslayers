import { Injectable } from '@angular/core';
import { SocketAuth } from 'app/models/socket/socket-auth.model';
import { SocketIdEnum } from 'app/models/socket/socket-id.enum';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly sockets: {
    -readonly [key in keyof typeof SocketIdEnum]?: Socket | undefined;
  };

  constructor() {
    this.sockets = {};
  }

  public add(socketId: SocketIdEnum, autoConnect: boolean, auth: SocketAuth): Socket {
    const socket = io('https://localhost:8080', { autoConnect, auth });
    this.sockets[socketId] = socket;

    return socket;
  }

  public remove(socketId: SocketIdEnum): void {
    delete this.sockets[socketId];
  }

  public connect(socketId: SocketIdEnum): Socket | undefined {
    const socket = this.sockets[socketId];
    socket?.connect();

    return socket;
  }

  public disconnect(socketId: SocketIdEnum): Socket | undefined {
    const socket = this.sockets[socketId];
    socket?.disconnect();

    return socket;
  }

  public get(socketId: SocketIdEnum): Socket | undefined {
    return this.sockets[socketId];
  }
}
