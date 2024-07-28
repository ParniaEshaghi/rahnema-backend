import fs from 'fs';
import path from 'path';
import { IDatabase } from './database.interface';
import { User } from '../modules/User/models/user.model';
import { Group } from '../modules/Group/models/group.model';
import { Expense } from '../modules/Expense/models/expense.model';

type Entity = User | Group | Expense;

export class JSONDatabase<T extends Entity> implements IDatabase<Entity> {
    private baseDir: string;
    private entityType: 'user' | 'group' | 'expense';

    constructor(baseDir: string, entityType: 'user' | 'group' | 'expense') {
        this.baseDir = path.resolve(baseDir);
        this.entityType = entityType;
        this.createBaseDir();
    }

    private createBaseDir(): void {
        try {
            if (!fs.existsSync(this.baseDir)) {
                fs.mkdirSync(this.baseDir, { recursive: true });
            }
        } catch (error) {
            console.error('Error creating base directory:', error);
            throw error;
        }
    }

    private getFilePath(id: string, groupId?: string): string {
        if (this.entityType === 'expense' && groupId) {
            const groupDir = path.join(this.baseDir, groupId);
            if (!fs.existsSync(groupDir)) {
                fs.mkdirSync(groupDir, { recursive: true });
            }
            return path.join(groupDir, `${id}.json`);
        } else {
            return path.join(this.baseDir, `${id}.json`);
        }
    }

    private readFile(filePath: string): Record<string, Entity> {
        if (!fs.existsSync(filePath)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    private writeFile(filePath: string, data: Record<string, Entity>): void {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
    }

    create(data: T): void {
        const id = (data as any).id;
        let groupId: string | undefined;

        if (this.entityType === 'expense') {
            groupId = (data as Expense).paidFor.id; 
        }

        const filePath = this.getFilePath(id, groupId);
        this.writeFile(filePath, { [id]: data });
    }

    read(id: string, groupId?: string): T | undefined {
        const filePath = this.getFilePath(id, groupId);
        const data = this.readFile(filePath);
        return data[id] as T;
    }

    update(id: string, data: Partial<T>): void {
        let groupId: string | undefined;

        if (this.entityType === 'expense') {
            groupId = (data as unknown as Expense).paidFor.id; 
        }

        const filePath = this.getFilePath(id, groupId);
        const existingData = this.readFile(filePath);
        if (existingData[id]) {
            existingData[id] = { ...existingData[id], ...data } as T;
            this.writeFile(filePath, existingData);
        }
    }

    delete(id: string): void {
        let groupId: string | undefined;

        if (this.entityType === 'expense') {
            const expense = this.read(id) as Expense;
            if (expense) {
                groupId = expense.paidFor.id;
            }
        }

        const filePath = this.getFilePath(id, groupId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            if (this.entityType === 'expense' && groupId) {
                const groupDir = path.join(this.baseDir, groupId);
                if (fs.existsSync(groupDir)) {
                    const files = fs.readdirSync(groupDir);
                    if (files.length === 0) {
                        fs.rmdirSync(groupDir);
                    }
                }
            }
        }
    }

    list(): T[] {
        const result: T[] = [];

        if (this.entityType === 'expense') {
            const expensesDir = path.join(this.baseDir);
            if (fs.existsSync(expensesDir)) {
                const groupDirs = fs.readdirSync(expensesDir);
                for (const groupId of groupDirs) {
                    const groupDir = path.join(expensesDir, groupId);
                    if (fs.statSync(groupDir).isDirectory()) {
                        const files = fs.readdirSync(groupDir);
                        for (const file of files) {
                            if (file.endsWith('.json')) {
                                const filePath = path.join(groupDir, file);
                                result.push(...Object.values(this.readFile(filePath)) as T[]);
                            }
                        }
                    }
                }
            }
        } else {
            const files = fs.readdirSync(this.baseDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.baseDir, file);
                    result.push(...Object.values(this.readFile(filePath)) as T[]);
                }
            }
        }

        return result;
    }

    purge(): void {
        if (fs.existsSync(this.baseDir)) {
            fs.rmdirSync(this.baseDir, { recursive: true });
        }
    }
}
