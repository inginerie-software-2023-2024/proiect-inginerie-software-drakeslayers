import { SocketsService } from './sockets-service';
import { Chat, ChatMessage, ChatUser } from '../utils/chat';
import { Profile, knexInstance } from '../utils/globals';
import { craftError, errorCodes } from '../utils/error';
import { getProfileByUserId } from '../controllers/ProfileController';

function getChatMembers(chatId: string): Promise<string[]> {
    return knexInstance('ChatUsers')
            .select('userId')
            .where({ chatId })
            .then((arr: ChatUser[]) => {
                if (arr)
                    return arr.map(x => x.userId as string);
                return [];
            })
}

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

    public createChat(chat: Chat, members: String[], requesterId: string): Promise<Chat | undefined>{
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
                    .then(() => trx('ChatUsers').insert(members.map(x => ({chatId: chat.id, userId: x, lastRead: new Date()})))))
                    .then(() => {
                        if (!chat.isGroup){
                            return getChatMembers(chat.id!)
                            .then(members => {
                                for (let i = 0; i < members.length; ++i)
                                    if (members[i] !== requesterId){
                                        return getProfileByUserId(members[i])
                                        .then((profile: Profile | undefined) => {
                                            chat.pictureUrl = profile?.profilePictureURL;
                                            chat.name = profile?.name === undefined ? profile?.username : profile.name;
                                            return chat;
                                        })
                                    }
                            })
                        }

                        return chat;
                    })
    }

    public getSingleChat(requesterId:string, chatId: string): Promise<Chat | undefined> {
        return knexInstance('Chats')
            .select('*')
            .where({ chatId })
            .first()
            .then((chat: Chat) => {
                if (!chat)
                    return chat; 

                if (!chat.isGroup){
                    return getChatMembers(chatId)
                    .then(members => {
                        for (let i = 0; i < members.length; ++i)
                            if (members[i] !== requesterId){
                                return getProfileByUserId(members[i])
                                .then((profile: Profile | undefined) => {
                                    chat.pictureUrl = profile?.profilePictureURL;
                                    chat.name = profile?.name === undefined ? profile?.username : profile.name;
                                    return chat;
                                })
                            }
                    })
                }
            });
    }

    public getChatsByUserId(userId: string): Promise<Chat[]>{
        return knexInstance
            .select('Chats.*')
            .from('Chats')
            .join('ChatUsers', 'Chats.id', '=', 'ChatUsers.chatId')
            .where('ChatUsers.userId', userId)
            .then((chats: Chat[]) => {
                const promises: Promise<Chat>[] = [];
                chats.forEach((c: Chat) => {
                    if (!c.isGroup){
                        const chatPromise: Promise<Chat> = 
                        getChatMembers(c.id!)
                        .then(members => {
                            for (let i = 0; i < members.length; ++i)
                                if (members[i] !== userId){
                                    return getProfileByUserId(members[i])
                                    .then((profile: Profile | undefined) => {
                                        c.pictureUrl = profile?.profilePictureURL;
                                        c.name = profile?.name === undefined ? profile?.username : profile.name;
                                        return c;
                                    })
                                }
                        }) as Promise<Chat>;

                        promises.push(chatPromise);
                    }else{
                        promises.push(Promise.resolve(c));
                    }
                })

                return Promise.all(promises);
            });
    }
}

export const chatService = new ChatService();