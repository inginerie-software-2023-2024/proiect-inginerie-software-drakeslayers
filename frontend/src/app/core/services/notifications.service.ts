import { Injectable } from '@angular/core';
import { ClientSocket, SocketAuth } from 'app/models/socket.model';
import { io } from 'socket.io-client';
import { UserService } from './user.service';
import { NotificationWithData } from 'app/models/notifications.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericResponse } from 'app/models/generic-response.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private socket: ClientSocket;

  private readonly newNotificationsSubject = new BehaviorSubject<NotificationWithData[]>([]);
  public readonly newNotifications$ = this.newNotificationsSubject.asObservable();

  constructor(private readonly userService: UserService, private readonly httpClient: HttpClient) {
    this.socket = this.createConnection();
  }

  private createConnection(userId: string | undefined = undefined): ClientSocket {
    return io('https://promeret.social', { autoConnect: false, auth: { userId } });
  }

  public onSocketButton(): void {
    this.socket.connect();
    this.socket.emit('any');
  }

  public get socketAuth(): SocketAuth {
    return this.socket.auth as SocketAuth;
  }

  public get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private startListening(): void {
    this.socket.connect();

    this.socket.on('followRequestNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    this.socket.on('postLikeNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    this.socket.on('commentLikeNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    this.socket.on('newCommentNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    this.socket.on('newReplyNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });
  }

  public setupSocket(): void {
    this.startListening();

    this.userService.currentUser$.subscribe((user) => {
      if (!user && this.socketAuth.userId !== undefined) {
        this.socket.disconnect();
        this.socket = this.createConnection();
        this.startListening();
      } else if (!!user && this.socketAuth.userId !== user.id) {
        this.socket.disconnect();
        this.socket = this.createConnection(user.id);
        this.startListening();
      }
    });
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public getNotifications(): Observable<GenericResponse<NotificationWithData[]>> {
    const url = 'api/notifications';
    return this.httpClient.get<GenericResponse<NotificationWithData[]>>(url);
  }
}
