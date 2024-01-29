import { NextFunction, Request, Response } from 'express';
import { Profile, knexInstance } from '../utils/globals';
import { craftError, errorCodes } from '../utils/error';
import { Notification, NotificationWithData } from '../utils/notifications';
import { getProfilesInRange } from './ProfileController';
import _ from 'lodash';

export function getProfilesForNotifications(notifications: Notification[]): Promise<Profile[]> {
    const userIds = _.uniq(notifications.map((notification) => notification.userId));

    return getProfilesInRange(userIds).then((profiles) => _.filter(profiles, (profile) => !!profile));
}

export class NotificationsController {
    getNotifications(req: Request, res: Response, next: NextFunction) {
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

                getProfilesForNotifications(arr).then((profiles) => {
                    const notificationsWithData: NotificationWithData[] = arr
                        .map((notification: Notification) => {
                            const profile = profiles.find((profile) => profile.userId === notification.userId);
                            return (
                                profile && {
                                    notification,
                                    profile
                                }
                            );
                        })
                        .filter((notification) => !!notification) as NotificationWithData[];

                    res.json({
                        error: undefined,
                        content: notificationsWithData
                    });
                });
            })
            .catch((err) => {
                console.error(err.message);
                const error = craftError(errorCodes.other, 'Please try again!');
                return res.status(500).json({ error, content: undefined });
            });
    }

    deleteNotification(req: Request, res: Response, next: NextFunction) {
        const userId = req.session.user?.id!;
        const notificationId = req.params.notificationId;
    
        knexInstance.transaction(async (trx) => {
          try {
            await trx('NotificationRecipients')
              .where({ userId, notificationId })
              .del();
    
            const deletedNotification = await trx('Notifications')
              .where('id', notificationId)
              .first();
    
            if (!deletedNotification) {
              return res.status(404).json({ error: craftError(errorCodes.notFound, 'Notification not found'), content: undefined });
            }
    
            res.json({ error: undefined, content: { notification: deletedNotification } });
          } catch (error) {
            await trx.rollback();
            const errorMessage = craftError(errorCodes.other, 'Failed to delete notification. Please try again!');
            return res.status(500).json({ error: errorMessage, content: undefined });
          }
        });
      }
}
