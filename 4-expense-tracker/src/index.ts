import express from 'express';
import expenseRoutes from './routes/expense.route';
import balanceRoutes from './routes/balance.route';

export type User = {
    id: string;
    name: string;
}

export type Group = {
    id: string;
    name: string;
    members: User[];
}

export type Expense = {
    id: string;
    paidBy: User;
    paidFor: Group;
    purpose: string;
    paidSum: number;
}

export const users: User[] = [];
export const groups: Group[] = [];
export const expenses: Expense[] = [];

const app = express();

app.use(express.json());

app.use('/expenses', expenseRoutes);
app.use('/balance', balanceRoutes);

export default app;
