import { Component } from '@angular/core';
import { NotificationsService } from 'app/core/services/notifications.service';

@Component({
  selector: 'mds-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent {
  public toggleButtonText: string = 'Disconnect';

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
