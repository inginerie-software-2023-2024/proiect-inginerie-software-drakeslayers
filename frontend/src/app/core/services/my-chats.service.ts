import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Chat } from 'app/models/chat/chat.model';
import { ChatCreate } from 'app/models/chat/chat-create.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MyChatsService {
  private readonly myChatsSubject = new BehaviorSubject<Chat[]>([]);
  private readonly myChats$ = this.myChatsSubject.asObservable();

  constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

  private addChat(chat: Chat): void {
    const chats = this.myChatsSubject.getValue();
    this.myChatsSubject.next([...chats, chat]);
  }

  public getMyChatsSync(): Chat[] {
    return this.myChatsSubject.value;
  }

  public getMyChatsAsync(): Observable<Chat[]> {
    return this.myChats$;
  }

  public reloadChats(): void {
    const currentUserId = this.userService.currentUser?.id;
    if (!currentUserId) {
      return;
    }
    this.chatService.getChatsByUserId(currentUserId).subscribe((res) => {
      this.myChatsSubject.next(res.content);
    });
  }

  // the difference with chatService.createChat is that it saves the chat in the internal state
  public createChat(data: ChatCreate): Observable<Chat> {
    return this.chatService.createChat(data).pipe(
      map((res) => res.content),
      tap((chat) => this.addChat(chat))
    );
  }
}
