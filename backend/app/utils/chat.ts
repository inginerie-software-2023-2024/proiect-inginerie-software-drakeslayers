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
    isGroup: boolean,
    pictureUrl: string | undefined | null,
}

export interface ChatUser{
    chatId: String, 
    userId: String, 
    lastRead: Date,
}