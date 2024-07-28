import { IDatabase } from '../../../database/database.interface';
import { User } from '../models/user.model';

export class UserRepository {
    private db: IDatabase<User>;

    constructor(db: IDatabase<User>) {
        this.db = db;
    }

    findUserById(id: string): User | undefined {
        return this.db.read(id);
    }

    addUser(user: User): void {
        this.db.create(user);
    }

    getUsers(): User[] {
        return this.db.list();
    }
}
