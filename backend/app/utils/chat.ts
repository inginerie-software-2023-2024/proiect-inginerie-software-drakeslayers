export interface ChatMessage {
    id: string,
    authorId: string,
    text: string,
    sentAt: Date,
}

export interface Chat{
    id: string | undefined, 
    name: string,
    createdAt: Date, 
}

export interface ChatUser{
    chatId: String, 
    userId: String, 
    lastRead: Date,
}