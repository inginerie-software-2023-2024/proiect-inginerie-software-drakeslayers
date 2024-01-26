import express, { Express, Request, Response, RequestHandler, NextFunction } from 'express';
import { chatService } from "../services/chat-service";
import { Chat } from "../utils/chat";
import { v4 as uuidv4 } from 'uuid';
import { craftError, errorCodes } from "../utils/error";
import { isPrivate } from './ProfileController';
import { isAcceptedFollower } from './FollowersController';

function filterPrivateMembers(requestingUserId: string, members: string[]): Promise<string[]>{

    const promises: Promise<undefined>[] = [];
    const result: string[] = [];

    members.forEach(m => {
        promises.push(new Promise(resolve => {
            return isPrivate(m)
            .then(res => {
                if (!res)
                    return false;
        
                return isAcceptedFollower(requestingUserId, m);
            })
            .then(cannotSee => {
                if (!cannotSee){
                    result.push(m);
                }

                return resolve(undefined);
            });;
        }))
    });

    return Promise.all(promises)
    .then(() => result);
}

export class ChatController {
    createChat(req: Request, res: Response, next: NextFunction) {

        if (!req?.body?.name){
            const error = craftError(errorCodes.noContent, "Chat name cannot be null!");
            return res.status(403).json({ error, content: undefined });
        }

        const chat: Chat = {
            id: uuidv4(),
            name: req.body.name,
            createdAt: new Date(),
        };

        const members: String[] = [req.session.user!.id];

        if (req.body.members){
            return filterPrivateMembers(req.session.user!.id, req.body.members)
            .then(filteredMembers => {
                if (filteredMembers.length !== req.body.members.length){
                    const error = craftError(errorCodes.privateProfile, "Some members have private profiles!");
                    return res.status(403).json({ error, content: undefined });
                }

                members.push(...filteredMembers);
                return chatService.createChat(chat, members)
                .then(() => res.status(200).json({ error: undefined, content: chat }));
            })
            .catch(err => {
                console.error(err.message);
                const error = craftError(errorCodes.other, "Please try creating chat again!");
                return res.status(500).json({ error, content: undefined });
            });
        }


        return chatService.createChat(chat, members)
        .then(() => res.status(200).json({ error: undefined, content: chat }))
        .catch(err => {
            console.error(err.message);
            const error = craftError(errorCodes.other, "Please try creating chat again!");
            return res.status(500).json({ error, content: undefined });
        });
    }

    sendMessage(req: Request, res: Response, next: NextFunction) {
        const chatMessage = {
            id: uuidv4(),
            authorId: req.session.user!.id,
            text: req.body.text,
            sentAt: new Date(),
        };

        return chatService.sendMessage(req.params.chatId, chatMessage)
               .then(() => res.status(200).json({ error: undefined, content: chatMessage }))
               .catch(err => {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try sending message again!");
                    return res.status(500).json({ error, content: undefined });
                });
    }

    readMessages(req: Request, res: Response, next: NextFunction) {
        return chatService.readMessages(req.session.user!.id, req.params.chatId)
               .then((chatMessages) => res.status(200).json({ error: undefined, content: chatMessages }))
               .catch(err => {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try reading messages again!");
                    return res.status(500).json({ error, content: undefined });
                });
    }
}