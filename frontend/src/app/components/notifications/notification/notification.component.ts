import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Notification, NotificationType } from 'app/models/notifications.model';
import { Profile } from 'app/models/profile.model';
import { formatInstagramTimestamp } from 'app/shared/utils/date';

@Component({
  selector: 'mds-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnChanges {
  @Input() public notification!: Notification;
  @Input() public profile!: Profile;
  public dateFormatted: string = '';
  public notificationType = NotificationType;

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['notification'].currentValue) {
      const notification = changes['notification'].currentValue as Notification;
      this.dateFormatted = formatInstagramTimestamp(notification.createdAt);
    }
  }
}
