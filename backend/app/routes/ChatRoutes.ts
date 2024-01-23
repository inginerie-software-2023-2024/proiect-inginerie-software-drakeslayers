import express from "express";
import { authenticationController, chatController } from "../utils/globals";

export const chatRouter = express.Router();

chatRouter.post('/chat', authenticationController.isAuthenticated, chatController.createChat);
chatRouter.post('/chat/:chatId/messages', authenticationController.isAuthenticated, chatController.sendMessage);
chatRouter.get('/chat/:chatId/messages', authenticationController.isAuthenticated, chatController.readMessages);
