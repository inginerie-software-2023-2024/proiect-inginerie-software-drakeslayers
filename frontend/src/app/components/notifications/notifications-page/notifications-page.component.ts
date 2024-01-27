import { Component } from '@angular/core';
import { NotificationsService } from 'app/core/services/notifications.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'mds-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent {
  public toggleButtonText: string = 'Disconnect';
  public readonly oldNotifications$ = this.notificationsService
    .getNotifications()
    .pipe(map((response) => response.content));
  public readonly newNotifications$ = this.notificationsService.newNotifications$;
  public readonly notifications$ = combineLatest([this.oldNotifications$, this.newNotifications$]).pipe(
    map(([oldNotifications, newNotifications]) => [...newNotifications, ...oldNotifications])
  );

  constructor(private readonly notificationsService: NotificationsService) {}

  public toggle(): void {
    if (this.notificationsService.isConnected) {
      this.toggleButtonText = 'Connect';
      this.notificationsService.disconnect();
    } else {
      this.toggleButtonText = 'Disconnect';
      this.notificationsService.connect();
    }
  }
}
