import { Injectable } from '@angular/core';
import { ChatWithMessages } from 'app/models/chat/chat-with-messages.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveChatService {
  private readonly activeChatSubject = new BehaviorSubject<ChatWithMessages | null>(null);
  public readonly activeChat$ = this.activeChatSubject.asObservable();

  constructor() {}

  public selectChat(chatWithMessages: ChatWithMessages): void {
    this.activeChatSubject.next(chatWithMessages);
  }

  public removeSelectedChat(): void {
    this.activeChatSubject.next(null);
  }

  public getSelectedChat(): ChatWithMessages | null {
    return this.activeChatSubject.value;
  }
}
