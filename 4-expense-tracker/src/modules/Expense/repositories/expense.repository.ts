import { Expense } from '../models/expense.model';
import { Member } from '../../Group/models/member.model';
import { IDatabase } from '../../../database/database.interface';

export class ExpenseRepository {
    private db: IDatabase<Expense>;

    constructor(db: IDatabase<Expense>) {
        this.db = db;
    }

    addExpense(expense: Expense): void {
        this.db.create(expense);
    }

    getExpensesByUser(userId: string): { paidByUser: Expense[], paidForUser: Expense[] } {
        const expenses = this.db.list();
        const paidByUser = expenses.filter(expense => expense.paidBy.id === userId);
        const paidForUser = expenses.filter(expense => 
            expense.paidFor.members.some((member: Member) => member.id === userId) && expense.paidBy.id !== userId
        );

        return { paidByUser, paidForUser };
    }
}
