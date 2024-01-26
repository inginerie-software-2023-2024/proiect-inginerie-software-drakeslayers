import express, { Express, Request, Response, RequestHandler, NextFunction } from 'express';
import { getAllFollowing, isAcceptedFollower } from './FollowersController';
import { Follower, Post, User, knexInstance } from '../utils/globals';
import { getPostsByUser } from './PostController';
import { craftError, errorCodes } from '../utils/error';
import path from 'path';
import { isPrivate } from './ProfileController';

function getAllUsers() {
    return knexInstance('Users')
        .select("*");
}

function filterPrivateUsers(requestingUserId: string, users: User[]): Promise<User[]>{

    const promises: Promise<undefined>[] = [];
    const result: User[] = [];

    users.forEach(u => {
        promises.push(new Promise(resolve => {
            return isPrivate(u.id)
            .then(res => {
                if (!res)
                    return false;
        
                return isAcceptedFollower(requestingUserId, u.id);
            })
            .then(cannotSee => {
                if (!cannotSee){
                    result.push(u);
                }

                return resolve(undefined);
            });;
        }))
    });

    return Promise.all(promises)
    .then(() => result);
}

function filterPrivateFollowing(requestingUserId: string, followers: Follower[]): Promise<Follower[]>{

    const promises: Promise<undefined>[] = [];
    const result: Follower[] = [];

    followers.forEach(f => {
        promises.push(new Promise(resolve => {
            return isPrivate(f.follows)
            .then(res => {
                if (!res)
                    return false;
        
                return isAcceptedFollower(requestingUserId, f.follows);
            })
            .then(cannotSee => {
                if (!cannotSee){
                    result.push(f);
                }

                return resolve(undefined);
            });;
        }))
    });

    return Promise.all(promises)
    .then(() => result);
}

export class FeedController {
    getFeed(req: Request, res: Response, next: NextFunction) {

        const userId = req.session.user?.id!;

        const usersPromise: Promise<User[]> = getAllUsers().then(users => filterPrivateUsers(userId, users));
        const followersPromise: Promise<Follower[]> = getAllFollowing(userId).then(followers => filterPrivateFollowing(userId, followers));;

        Promise.all([usersPromise, followersPromise])
            .then(([users, followers]: [User[], Follower[]]) => {

                // this is used to set a higher priority 
                // to posts made by user or those he follows
                // when displaying the feed 
                const followingIDSet: Set<string> = new Set<string>();
                followers.forEach(x => followingIDSet.add(x.follows));
                followingIDSet.add(userId);
                console.log(users);
                const promises: Promise<Post[]>[] = users.map(u => getPostsByUser(u.id));

                Promise.allSettled(promises)
                    .then((results: PromiseSettledResult<Post[]>[]) => {

                        const posts: Post[] = [];
                        results.forEach(r => {
                            if (r.status === "fulfilled") {
                                const arr: Post[] = r.value;
                                arr.forEach(p => {
                                    p.picturesURLs = p.picturesURLs.map(f => {
                                        const newPath: string = path.join('users', p.userId, 'pictures');
                                        return path.join(newPath, f);
                                    });
                                });

                                posts.push(...arr);
                            }
                        });

                        return posts.sort((a, b) => {
                            const res1: boolean = followingIDSet.has(a.userId);
                            const res2: boolean = followingIDSet.has(b.userId);

                            // prioritize following and user posts 
                            if (res1 && !res2)
                                return -1;
                            if (!res1 && res2)
                                return 1;

                            return a.createdAt.valueOf() - b.createdAt.valueOf()
                        });
                    })
                    .then((posts: Post[]) => {
                        return res.status(200).json({ error: undefined, content: posts });
                    })
            })
            .catch(err => {
                if (!err.error) {
                    console.error(err.message);
                    const error = craftError(errorCodes.other, "Please try again!");
                    return res.status(500).json({ error, content: undefined });
                } else {
                    console.error(err.error.errorMsg);
                    return res.status(404).json(err);
                }
            });
    }
}