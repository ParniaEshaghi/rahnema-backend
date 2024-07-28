import { IDatabase } from '../../../database/database.interface';
import { Group } from '../models/group.model';

export class GroupRepository {
    private db: IDatabase<Group>;

    constructor(db: IDatabase<Group>) {
        this.db = db;
    }

    findGroupById(id: string): Group | undefined {
        return this.db.read(id);
    }

    addGroup(group: Group): void {
        this.db.create(group);
    }

    getGroups(): Group[] {
        return this.db.list();
    }
}
