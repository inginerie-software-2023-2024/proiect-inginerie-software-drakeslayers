import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateChatComponent } from '../create-chat/create-chat.component';
import { MyChatsService } from 'app/core/services/my-chats.service';
import { Chat } from 'app/models/chat/chat.model';
import { Observable, concatMap, forkJoin, map, takeUntil, tap } from 'rxjs';
import { ChatWithMessages } from 'app/models/chat/chat-with-messages.model';
import _ from 'lodash';
import { ChatService } from 'app/core/services/chat.service';
import { SubscriptionCleanup } from 'app/shared/utils/subscription-cleanup';
import { ActiveChatService } from 'app/core/services/active-chat.service';

@Component({
  selector: 'mds-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent extends SubscriptionCleanup {
  public chatsWithMessages$ = this.myChatsService.myChats$;
  public chatsWithMessages: ChatWithMessages[] = [];

  public firstLoad: boolean = true;
  public activeChatId: string | null = null;

  constructor(
    private readonly dialog: MatDialog,
    private readonly myChatsService: MyChatsService,
    private readonly chatService: ChatService,
    private readonly activeChatService: ActiveChatService
  ) {
    super();
    this.myChatsService.reloadChats();
    this.chatsWithMessages$
      .pipe(
        tap((chats) => (this.chatsWithMessages = chats)),
        takeUntil(this.destroy$)
      )
      .subscribe((chats) => {
        // If there is no active chat, select the first one
        if (this.firstLoad && chats.length > 0) {
          this.onChatClick(chats[0].chat.id);
          this.firstLoad = false;
        }
      });
  }

  public openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { hasBackdrop: true, width: '400px', height: '500px' });
  }

  public onChatClick(chatId: string): void {
    this.activeChatId = chatId;
    // Mark messages as read
    this.chatService.readMessages(chatId).subscribe();
    this.activeChatService.selectChat(chatId);
  }

  @HostListener('document:keydown.escape')
  public clearSelection(): void {
    this.activeChatId = null;
    this.activeChatService.removeSelectedChat();
  }
}
