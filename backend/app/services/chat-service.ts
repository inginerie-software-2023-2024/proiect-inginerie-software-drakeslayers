import { SocketsService } from './sockets-service';
import { Chat, ChatMessage } from '../utils/chat';
import { knexInstance } from '../utils/globals';
import { craftError, errorCodes } from '../utils/error';

class ChatService {
    private readonly socketsService: SocketsService;

    constructor() {
        this.socketsService = new SocketsService();
    }

    public getSocketsService(){
        return this.socketsService;
    }

    public sendMessage(chatId: string, chatMessage: ChatMessage): Promise<any>{

        const message = {
            chatId,
            ...chatMessage
        };

        return knexInstance('ChatMessages')
               .insert(message)
               .then(arr => {
                    if (arr.length === 0) {
                        throw {
                            error: craftError(errorCodes.other, 'Please try sending message again!'),
                            content: undefined
                        };
                    }
               })
               .then(() => knexInstance('ChatUsers').select('userId').where({ chatId }))
               .then(users => users.map(x => x.userId))
               .then((members: string[]) => {
                    members.forEach(m => {
                        const socket = this.socketsService.getSocket(m);
                        if (!!socket){
                            socket.emit('newChatMessage', { chatMessage }, () => knexInstance('ChatUsers').update({ lastRead: new Date()}).where({userId: m, chatId}));
                        }
                    })
               })
               .then(() => knexInstance('ChatUsers').update({ lastRead: new Date()}).where({userId: chatMessage.authorId, chatId}));

    }

    public readMessages(userId: string, chatId: string): Promise<any>{
        const lastRead = new Promise(resolve => {
            return knexInstance('ChatUsers')
                .select('lastRead')
               .where({userId, chatId})
               .first()
               .then(user => {
                    if (!user) {
                        throw {
                            error: craftError(errorCodes.other, 'User or chat room not found!'),
                            content: undefined
                        };
                    }

                    return resolve(user.lastRead);
               });
        });

        const messages = knexInstance('ChatMessages').where({chatId});

        return Promise.all([lastRead, messages])
        .then(( [lastRead, messages] ) => {
            return knexInstance('ChatUsers').update({ lastRead: new Date()}).where({userId, chatId})
            .then(() => ({ lastRead, messages}));
        });
    }

    public createChat(chat: Chat, members: String[]): Promise<any>{
        return knexInstance
               .transaction(trx => 

                // create chat room
                trx('Chats')
                    .insert(chat)
                    .then(arr => {
                        if (arr.length === 0) {
                            throw {
                                error: craftError(errorCodes.other, 'Please try creating chat again!'),
                                content: undefined
                            };
                        }
                    })
                    // map members of chat to room
                    .then(() => trx('ChatUsers').insert(members.map(x => ({chatId: chat.id, userId: x, lastRead: new Date()})))));
    }
}

export const chatService = new ChatService();