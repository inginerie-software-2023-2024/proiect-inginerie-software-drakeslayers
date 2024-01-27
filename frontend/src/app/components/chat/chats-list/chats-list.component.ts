import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateChatComponent } from '../create-chat/create-chat.component';

@Component({
  selector: 'mds-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent {
  constructor(private readonly dialog: MatDialog) {}

  public openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { hasBackdrop: true, width: '400px', height: '500px' });
  }
}
