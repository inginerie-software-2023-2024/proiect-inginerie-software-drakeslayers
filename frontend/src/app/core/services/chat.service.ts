import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatCreate } from 'app/models/chat/chat-create.model';
import { ChatMessage } from 'app/models/chat/chat-message.model';
import { ChatReadMessagesResponse } from 'app/models/chat/chat-read-messages.response';
import { Chat } from 'app/models/chat/chat.model';
import { GenericResponse } from 'app/models/generic-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private readonly httpClient: HttpClient) {}

  public createChat(data: ChatCreate): Observable<GenericResponse<Chat>> {
    return this.httpClient.post<GenericResponse<Chat>>('/api/chat', data);
  }

  public sendMessage(chatId: string, message: string): Observable<GenericResponse<ChatMessage>> {
    return this.httpClient.post<GenericResponse<ChatMessage>>(`/api/chat/${chatId}/messages`, { text: message });
  }

  public getMessages(chatId: string): Observable<GenericResponse<ChatReadMessagesResponse>> {
    return this.httpClient.get<GenericResponse<ChatReadMessagesResponse>>(`/api/chat/${chatId}/messages`);
  }

  public readMessages(chatId: string): Observable<GenericResponse<undefined>> {
    return this.httpClient.post<GenericResponse<undefined>>(`/api/chat/${chatId}/read`, {});
  }

  public getChatsByUserId(userId: string): Observable<GenericResponse<Chat[]>> {
    return this.httpClient.get<GenericResponse<Chat[]>>(`/api/chat`, { params: { userId } });
  }
}
