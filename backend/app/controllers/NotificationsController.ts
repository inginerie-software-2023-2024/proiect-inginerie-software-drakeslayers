import { NextFunction, Request, Response } from 'express';
import { knexInstance } from '../utils/globals';
import { craftError, errorCodes } from '../utils/error';

export class NotificationsController {
    getNotifications(req: Request, res: Response, next: NextFunction) {
        console.log('getNotifications');
        const userId = req.session.user?.id!;

        knexInstance('NotificationRecipients')
            .where('NotificationRecipients.userId', userId)
            .join('Notifications', 'Notifications.id', '=', 'NotificationRecipients.notificationId')
            .orderBy('Notifications.createdAt', 'desc')
            .select('Notifications.*')
            .then((arr) => {
                if (arr.length === 0) {
                    res.json({
                        error: undefined,
                        content: []
                    });
                    return;
                }

                res.json({
                    error: undefined,
                    content: arr
                });
            })
            .catch((err) => {
                console.error(err.message);
                const error = craftError(errorCodes.other, 'Please try again!');
                return res.status(500).json({ error, content: undefined });
            });
    }
}
