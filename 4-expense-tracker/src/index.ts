import express from 'express';
import expenseRoutes from './routes/expense.route';
import balanceRoutes from './routes/balance.route';
import { User, Group, Expense } from './types';

export const users: User[] = [];
export const groups: Group[] = [];
export const expenses: Expense[] = [];

const app = express();

app.use(express.json());

app.use('/expense', expenseRoutes);
app.use('/balance', balanceRoutes);

export default app;
