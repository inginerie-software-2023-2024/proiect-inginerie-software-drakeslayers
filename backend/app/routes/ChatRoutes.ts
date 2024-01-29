import express from "express";
import { authenticationController, chatController, uploadMediaChatPicture } from "../utils/globals";

export const chatRouter = express.Router();

chatRouter.post('/chat', authenticationController.isAuthenticated, uploadMediaChatPicture, chatController.createChat);
chatRouter.post('/chat/:chatId/messages', authenticationController.isAuthenticated, chatController.sendMessage);
chatRouter.get('/chat/:chatId/messages', authenticationController.isAuthenticated, chatController.getMessages);
chatRouter.post('/chat/:chatId/read', authenticationController.isAuthenticated, chatController.readMessages);
chatRouter.get('/chat/:chatId', authenticationController.isAuthenticated, chatController.getSingleChat);
chatRouter.get('/chat', authenticationController.isAuthenticated, chatController.getChatsByUserId);
