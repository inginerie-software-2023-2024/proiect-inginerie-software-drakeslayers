import { User, knexInstance } from '../utils/globals';

export function isAdmin(userId: string): Promise<boolean>{
    return knexInstance('Users')
        .select('isAdmin')
        .where({ userId })
        .first()
        .then((user: Partial<User>) => user.isAdmin!);
}