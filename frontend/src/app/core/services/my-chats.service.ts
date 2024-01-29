import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { BehaviorSubject, Observable, forkJoin, map, tap } from 'rxjs';
import { Chat } from 'app/models/chat/chat.model';
import { ChatCreate } from 'app/models/chat/chat-create.model';
import { UserService } from './user.service';
import _ from 'lodash';
import { ChatWithMessages } from 'app/models/chat/chat-with-messages.model';
import { ChatMessage } from 'app/models/chat/chat-message.model';
import { RealtimeMessage } from 'app/models/chat/realtime-message.model';

@Injectable({
  providedIn: 'root'
})
export class MyChatsService {
  private readonly myChatsSubject = new BehaviorSubject<ChatWithMessages[]>([]);
  // keep the chats sorted by last message sent
  public readonly myChats$ = this.myChatsSubject
    .asObservable()
    .pipe(
      map((chats) =>
        chats.sort(
          (a, b) =>
            new Date(b.messages.slice(-1)[0]?.sentAt || b.chat.createdAt).getTime() -
            new Date(a.messages.slice(-1)[0]?.sentAt || a.chat.createdAt).getTime()
        )
      )
    );

  constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

  private addChat(chat: Chat): void {
    const chats = this.myChatsSubject.getValue();
    this.chatService.getMessages(chat.id).subscribe((res) => {
      const chatWithMessages: ChatWithMessages = {
        chat,
        lastRead: res.content.lastRead,
        messages: res.content.messages
      };
      this.myChatsSubject.next([...chats, chatWithMessages]);
    });
  }

  public getMyChats(): ChatWithMessages[] {
    return this.myChatsSubject.value;
  }

  public reloadChats(): void {
    const currentUserId = this.userService.currentUser?.id;
    if (!currentUserId) {
      return;
    }

    // fetch chats and then for each chat fetch messages
    this.chatService.getChatsByUserId(currentUserId).subscribe((res) => {
      const chats = res.content;
      forkJoin(
        chats.map((chat) =>
          this.chatService.getMessages(chat.id).pipe(
            // create new ChatWithMessages object
            map(
              ({ content: { lastRead, messages } }) =>
                ({
                  chat,
                  lastRead,
                  messages
                } as ChatWithMessages)
            )
          )
        )
      ).subscribe((chatsWithMessages) => {
        this.myChatsSubject.next(chatsWithMessages);
      });
    });
  }

  // the difference with chatService.createChat is that it saves the chat in the internal state
  public createChat(data: ChatCreate): Observable<Chat> {
    return this.chatService.createChat(data).pipe(
      map((res) => res.content),
      tap((chat) => this.addChat(chat))
    );
  }

  private updateChat(chatId: string, updateFn: (chat: ChatWithMessages) => void): ChatWithMessages | undefined {
    const chats = this.myChatsSubject.getValue();
    const chatIndex = _.findIndex(chats, (chat) => chat.chat.id === chatId);
    if (chatIndex !== -1) {
      const chat = chats[chatIndex];
      updateFn(chat);
      chats[chatIndex] = chat;
      this.myChatsSubject.next(chats);
      return chat;
    }
    return undefined;
  }

  public sendMessage(chatId: string, message: string): Observable<ChatMessage> {
    return this.chatService.sendMessage(chatId, message).pipe(
      map((res) => res.content),
      tap((message) =>
        this.updateChat(chatId, (chat) => {
          if (!chat.messages.find((m) => m.id === message.id)) {
            chat.messages.push(message);
          }
        })
      )
    );
  }

  public addRealTimeMessage(message: RealtimeMessage): void {
    this.updateChat(message.chatId, (chat) => {
      if (!chat.messages.find((m) => m.id === message.id)) {
        chat.messages.push(message);
      }
    });
  }

  public readMessages(chatId: string): Observable<undefined> {
    return this.chatService.readMessages(chatId).pipe(
      map((res) => res.content),
      tap(() => {
        this.updateChat(chatId, (chat) => (chat.lastRead = new Date().toISOString()));
      })
    );
  }
}
