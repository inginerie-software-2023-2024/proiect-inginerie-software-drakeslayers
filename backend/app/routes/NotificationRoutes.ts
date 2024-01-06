import express from 'express';
import { authenticationController, notificationsController } from '../utils/globals';

export const notificationRouter = express.Router();

notificationRouter.get(
    '/notifications',
    authenticationController.isAuthenticated,
    notificationsController.getNotifications
);
