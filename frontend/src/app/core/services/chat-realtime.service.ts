import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { SocketIdEnum } from 'app/models/socket/socket-id.enum';
import { SocketTypeEnum } from 'app/models/socket/socket-type.enum';
import { Observable, ReplaySubject } from 'rxjs';
import { RealtimeMessage } from 'app/models/chat/realtime-message.model';
import { SocketAuth } from 'app/models/socket/socket-auth.model';
import { ChatSocket } from 'app/models/socket/chat-socket.model';
import { UserService } from './user.service';

const SOCKET_ID = SocketIdEnum.chat;
const SOCKET_TYPE = SocketTypeEnum.chat;

@Injectable({
  providedIn: 'root'
})
export class ChatRealtimeService {
  private readonly realtimeMessagesSubject: ReplaySubject<RealtimeMessage> = new ReplaySubject<RealtimeMessage>();
  public readonly realtimeMessages$: Observable<RealtimeMessage> = this.realtimeMessagesSubject.asObservable();

  constructor(private readonly socketService: SocketService, private readonly userService: UserService) {}

  private createConnection(userId: string | undefined = undefined): ChatSocket {
    const socketAuth: SocketAuth = { userId, socketType: SOCKET_TYPE };

    return this.socketService.add(SOCKET_ID, false, socketAuth);
  }

  private connectSocket(): void {
    this.socketService.connect(SOCKET_ID);
  }

  private disconnectSocket(): void {
    this.socketService.disconnect(SOCKET_ID);
  }

  private getSocket(): ChatSocket | undefined {
    return this.socketService.get(SOCKET_ID);
  }

  private registerListeners(): void {
    const socket = this.getSocket();
    if (!socket) {
      return;
    }

    socket.on('newChatMessage', (message: RealtimeMessage) => {
      this.realtimeMessagesSubject.next(message);
    });
  }

  public get socketAuth(): SocketAuth | undefined {
    return this.getSocket()?.auth as SocketAuth | undefined;
  }

  public get isConnected(): boolean {
    return this.getSocket()?.connected || false;
  }

  public startListening(): void {
    this.userService.currentUser$.subscribe((user) => {
      if (!user && this.socketAuth?.userId !== undefined) {
        // user is logged out, we need to disconnect the socket
        this.disconnectSocket();
      } else if (!!user && this.socketAuth?.userId !== user.id) {
        // user is logged in, we need to disconnect the socket and reconnect with the new user id
        this.disconnectSocket();
        this.createConnection(user.id);
        this.connectSocket();
        this.registerListeners();
      }
    });
  }

  public stopListening(): void {}
}
