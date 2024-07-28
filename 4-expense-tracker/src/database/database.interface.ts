export interface IDatabase<T> {
    create(data: T): void;
    read(id: string): T | undefined;
    update(id: string, data: Partial<T>): void;
    delete(id: string): void;
    list(): T[];
}