import { Injectable } from '@angular/core';
import { ClientSocket, SocketAuth } from 'app/models/socket.model';
import { Socket, io } from 'socket.io-client';
import { UserService } from './user.service';
import { ackCallback } from 'app/shared/utils/socket';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private socket: ClientSocket;

  constructor(private readonly userService: UserService) {
    this.socket = this.createNewConnection();
  }

  private createNewConnection(userId: string | undefined = undefined): ClientSocket {
    return io('https://localhost:8080', { autoConnect: false, auth: { userId } });
  }

  public get socketAuth(): SocketAuth {
    return this.socket.auth as SocketAuth;
  }

  public startListening(): void {
    this.socket.connect();

    this.userService.currentUser$.subscribe((user) => {
      if (!user && this.socketAuth.userId !== undefined) {
        this.socket.disconnect();
        this.socket = this.createNewConnection();
        this.socket.connect();
      } else if (!!user && this.socketAuth.userId !== user.id) {
        this.socket.disconnect();
        this.socket = this.createNewConnection(user.id);
        this.socket.connect();
      }
    });
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
