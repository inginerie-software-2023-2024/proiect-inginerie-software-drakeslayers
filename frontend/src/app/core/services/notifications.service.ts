import { Injectable } from '@angular/core';
import { NotificationSocket } from 'app/models/socket/notification-socket.model';
import { UserService } from './user.service';
import { NotificationWithData } from 'app/models/notifications.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericResponse } from 'app/models/generic-response.model';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { SocketIdEnum } from 'app/models/socket/socket-id.enum';
import { SocketTypeEnum } from 'app/models/socket/socket-type.enum';
import { SocketAuth } from 'app/models/socket/socket-auth.model';

const SOCKET_ID = SocketIdEnum.notifications;
const SOCKET_TYPE = SocketTypeEnum.notifications;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly newNotificationsSubject = new BehaviorSubject<NotificationWithData[]>([]);
  public readonly newNotifications$ = this.newNotificationsSubject.asObservable();

  constructor(
    private readonly userService: UserService,
    private readonly httpClient: HttpClient,
    private readonly socketService: SocketService
  ) {
    this.createConnection();
  }

  private createConnection(userId: string | undefined = undefined): NotificationSocket {
    const socketAuth: SocketAuth = { userId, socketType: SOCKET_TYPE };

    return this.socketService.add(SOCKET_ID, false, socketAuth);
  }

  private connectSocket(): void {
    this.socketService.connect(SOCKET_ID);
  }

  private disconnectSocket(): void {
    this.socketService.disconnect(SOCKET_ID);
  }

  private getSocket(): NotificationSocket | undefined {
    return this.socketService.get(SOCKET_ID);
  }

  public onSocketButton(): void {
    this.connectSocket();
    this.getSocket()?.emit('any');
  }

  public get socketAuth(): SocketAuth {
    return this.getSocket()?.auth as SocketAuth;
  }

  public get isConnected(): boolean {
    return this.getSocket()?.connected || false;
  }

  private startListening(): void {
    this.connectSocket();
    const socket = this.getSocket()!;

    socket.on('followRequestNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    socket.on('newFollowerNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    socket.on('postLikeNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    socket.on('commentLikeNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    socket.on('newCommentNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });

    socket.on('newReplyNotification', (notification: NotificationWithData) => {
      const newNotifications = this.newNotificationsSubject.value;
      newNotifications.unshift(notification);
      this.newNotificationsSubject.next(newNotifications);
    });
  }

  public setupSocket(): void {
    this.startListening();

    this.userService.currentUser$.subscribe((user) => {
      if (!user && this.socketAuth.userId !== undefined) {
        this.disconnectSocket();
        this.createConnection();
        this.startListening();
      } else if (!!user && this.socketAuth.userId !== user.id) {
        this.disconnectSocket();
        this.createConnection(user.id);
        this.startListening();
      }
    });
  }

  public connect(): void {
    this.connectSocket();
  }

  public disconnect(): void {
    this.disconnectSocket();
  }

  public getNotifications(): Observable<GenericResponse<NotificationWithData[]>> {
    const url = 'api/notifications';
    return this.httpClient.get<GenericResponse<NotificationWithData[]>>(url);
  }

  public removeNotification(notificationId: string): void {
    const currentNotifications = this.newNotificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.notification.id !== notificationId);
    this.newNotificationsSubject.next(updatedNotifications);
    this.httpClient.delete(`api/notifications/${notificationId}`, { withCredentials: true }).subscribe(/* gestionează răspunsul */);
  }

}
