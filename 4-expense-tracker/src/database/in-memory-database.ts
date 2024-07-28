import { Group } from "../modules/Group/models/group.model";
import { User } from "../modules/User/models/user.model";
import { Expense } from "../modules/Expense/models/expense.model";
import { IDatabase } from "./database.interface";

type Entity = User | Group | Expense;

export class InMemoryDatabase<T extends Entity> implements IDatabase<Entity> {
    private db: Entity[] = [];

    create(data: T): void {
        this.db.push(data);
    }

    read(id: string): T | undefined {
        return this.db.find(data => data.id === id) as T;
    }

    update(id: string, data: Partial<T>): void {
        const dataIndex = this.db.findIndex(data => data.id === id);
        if (dataIndex !== -1) {
            // Ensure the type assertion to `T` for merging partial data
            this.db[dataIndex] = { ...this.db[dataIndex], ...data } as T;
        }
    }

    delete(id: string): void {
        this.db = this.db.filter(data => data.id !== id);
    }

    list(): T[] {
        return this.db as T[];
    }
}
