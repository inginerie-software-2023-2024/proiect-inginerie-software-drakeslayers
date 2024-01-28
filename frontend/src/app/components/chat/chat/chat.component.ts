import { Component } from '@angular/core';
import { ActiveChatService } from 'app/core/services/active-chat.service';
import { MyChatsService } from 'app/core/services/my-chats.service';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'mds-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public readonly activeChat$ = this.activeChatService.activeChat$;
  public readonly currentUser$ = this.userService.currentUser$;

  public message: string = '';

  constructor(
    private readonly activeChatService: ActiveChatService,
    private readonly myChatsService: MyChatsService,
    private readonly userService: UserService
  ) {}

  public sendMessage(chatId: string): void {
    if (this.message.trim() !== '') {
      this.myChatsService.sendMessage(chatId, this.message).subscribe();
      this.message = '';
    }
  }
}
