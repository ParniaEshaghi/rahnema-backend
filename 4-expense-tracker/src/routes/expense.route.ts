import { Router } from 'express';
import { ExpenseService } from '../modules/Expense/services/expense.service';
import { handleExpress } from '../utility/handle-express';


export const makeExpenseRouter = (expenseService: ExpenseService) => {
    const router = Router();

    router.post("/", (req, res) => {
        const { paidById, paidForId, purpose, paidSum } = req.body;

        handleExpress(res, async () => {
            if (!paidById || !paidForId || !purpose || !paidSum) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const newExpense = expenseService.createExpense({ paidById, paidForId, purpose, paidSum });
            res.status(201).json(newExpense);
            return newExpense;
        });
    });

    router.get("/:id", (req, res) => {
        const userId = req.params.id;

        handleExpress(res, async () => {
            const userExpenses = expenseService.getUserExpenses(userId);
            return userExpenses;
        });
    });

    return router;
};
