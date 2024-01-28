import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatCreate } from 'app/models/chat/chat-create.model';
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

  public getChatsByUserId(userId: string): Observable<GenericResponse<Chat[]>> {
    return this.httpClient.get<GenericResponse<Chat[]>>(`/api/chat`, { params: { userId } });
  }
}
