import { Component } from '@angular/core';
import { ChatRealtimeService } from 'app/core/services/chat-realtime.service';
import { MyChatsService } from 'app/core/services/my-chats.service';

@Component({
  selector: 'mds-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent {
  constructor(
    private readonly chatRealtimeService: ChatRealtimeService,
    private readonly myChatsService: MyChatsService
  ) {
    this.chatRealtimeService.startListening();
    this.chatRealtimeService.realtimeMessages$.subscribe((message) => this.myChatsService.addRealTimeMessage(message));
  }
}
