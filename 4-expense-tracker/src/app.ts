import express from 'express';
import { makeBalanceRouter } from './routes/balance.route';
import { GroupService } from './modules/Group/services/group.service';
import { makeExpenseRouter } from './routes/expense.route';
import { ExpenseService } from './modules/Expense/services/expense.service';


export const appMaker = (groupService: GroupService, expenseService: ExpenseService) => {

    const app = express();
    app.use(express.json());
    app.use('/balance', makeBalanceRouter(groupService));
    app.use('/expense', makeExpenseRouter(expenseService));

    return app;
}
