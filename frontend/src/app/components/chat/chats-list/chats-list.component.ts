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

@Component({
  selector: 'mds-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent extends SubscriptionCleanup {
  public myChats$ = this.myChatsService.getMyChatsAsync().pipe(
    tap((chats) => {
      this.previousChats = this.myChats;
      this.myChats = chats;
    })
  );
  public myChats: Chat[] = [];
  public previousChats: Chat[] = [];

  public newChats$: Observable<Chat[]> = this.myChats$.pipe(
    map((chats) => _.differenceBy(chats, this.previousChats, 'id'))
  );
  public chatsWithMessages$: Observable<ChatWithMessages[]> = this.newChats$.pipe(
    concatMap((newChats) =>
      forkJoin(
        newChats.map((chat) =>
          this.chatService.getMessages(chat.id).pipe(
            // create new ChatWithMessages object
            map(({ content: { lastRead, messages } }) => ({
              chat,
              lastRead,
              messages
            }))
          )
        )
      )
    ),
    map((chatsWithMessages) =>
      [...this.chatsWithMessages, ...chatsWithMessages].sort(
        (a, b) =>
          new Date(b.messages.slice(-1)[0]?.sentAt || b.lastRead).getTime() -
          new Date(a.messages.slice(-1)[0]?.sentAt || a.lastRead).getTime()
      )
    ),
    tap((chatsWithMessages) => (this.chatsWithMessages = chatsWithMessages))
  );
  public chatsWithMessages: ChatWithMessages[] = [];

  public activeChatId: string | null = null;

  constructor(
    private readonly dialog: MatDialog,
    private myChatsService: MyChatsService,
    private readonly chatService: ChatService
  ) {
    super();
    this.myChatsService.reloadChats();
    this.chatsWithMessages$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  public openCreateChatDialog(): void {
    this.dialog.open(CreateChatComponent, { hasBackdrop: true, width: '400px', height: '500px' });
  }

  public onChatClick(chatId: string): void {
    this.activeChatId = chatId;
    // Mark messages as read
    this.chatService.readMessages(chatId).subscribe();
  }

  @HostListener('document:keydown.escape')
  public clearSelection(): void {
    this.activeChatId = null;
  }
}
