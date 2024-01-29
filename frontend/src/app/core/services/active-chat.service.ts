import { Injectable } from '@angular/core';
import { ChatWithMessages } from 'app/models/chat/chat-with-messages.model';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { MyChatsService } from './my-chats.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveChatService {
  private readonly activeChatIdSubject = new BehaviorSubject<string | null>(null);
  public readonly activeChat$: Observable<ChatWithMessages | null> = combineLatest([
    this.activeChatIdSubject.asObservable(),
    this.myChatsService.myChats$
  ]).pipe(
    map(([activeChatId, chats]) => {
      if (!activeChatId) {
        return null;
      }

      return chats.find((chat) => chat.chat.id === activeChatId) || null;
    })
  );

  constructor(private readonly myChatsService: MyChatsService) {}

  public selectChat(chatId: string): void {
    this.activeChatIdSubject.next(chatId);
  }

  public removeSelectedChat(): void {
    this.activeChatIdSubject.next(null);
  }
}
