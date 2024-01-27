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
}
