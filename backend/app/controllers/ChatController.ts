import express, { Express, Request, Response, RequestHandler, NextFunction } from 'express';
import { chatService } from "../services/chat-service";
import { Chat } from "../utils/chat";
import { v4 as uuidv4 } from 'uuid';
import { craftError, errorCodes } from "../utils/error";
import { defaultProfilePictureURL } from './ProfileController';

export class ChatController {
    createChat(req: Request, res: Response, next: NextFunction) {
        if (!req?.body?.name && req?.body?.isGroup){
            const error = craftError(errorCodes.noContent, "Group name cannot be null!");
            return res.status(403).json({ error, content: undefined });
        }

        if (req.body.memberIds.length > 1 && req.body.isGroup === false){
            const error = craftError(errorCodes.noContent, "Cannot have 1-1 chat with more than 2 users!");
            return res.status(400).json({ error, content: undefined });
        }

        const chat: Chat = {
            id: uuidv4(),
            name: req.body.name,
            createdAt: new Date(),
            isGroup: req.body.isGroup,
            pictureUrl: req.file === undefined ? defaultProfilePictureURL : req.file?.filename || '',
        };

        const memberIds: String[] = [req.session.user!.id];
        if (req.body.memberIds){
            memberIds.push(...req.body.memberIds);
        }

        return chatService.createChat(chat, memberIds, req.session.user!.id)
        .then((chat: Chat | undefined) => res.status(200).json({ error: undefined, content: chat }))
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

    getMessages(req: Request, res: Response, next: NextFunction) {
        return chatService.getMessages(req.session.user!.id, req.params.chatId)
               .then((chatMessages) => res.status(200).json({ error: undefined, content: chatMessages }))
               .catch(err => {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try reading messages again!");
                    return res.status(500).json({ error, content: undefined });
                });
    }

    readMessages(req: Request, res: Response, next: NextFunction) {
        return chatService.readMessages(req.session.user!.id, req.params.chatId)
               .then(() => res.status(200).json({ error: undefined, content: undefined }))
               .catch(err => {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try reading messages again!");
                    return res.status(500).json({ error, content: undefined });
                });
    }

    getSingleChat(req: Request, res: Response, next: NextFunction) {
        return chatService.getSingleChat(req.session.user!.id, req.params.id)
                .then(chat => res.status(200).json({ error: undefined, content: chat }))
                .catch(err => {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try getting chat again!");
                    return res.status(500).json({ error, content: undefined });
                });
    }

    getChatsByUserId(req: Request, res: Response, next: NextFunction) {
        const userId: string | undefined = req.query?.userId as string;

        if (!userId){
            const error = craftError(errorCodes.noContent, "Invalid user id!");
            return res.status(400).json({ error, content: undefined });
        }

        return chatService.getChatsByUserId(userId)
            .then(chats => res.status(200).json({ error: undefined, content: chats }))
            .catch(err => {
                console.error(err.message);
                const error = craftError(errorCodes.other, "Please try getting chats again!");
                return res.status(500).json({ error, content: undefined });
            });
    }
}