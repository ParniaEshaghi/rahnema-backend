import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { users, groups, expenses, User, Group, Expense } from '../index';

const router = Router();

router.post("/", (req, res) => {
    const { paidById, paidForId, purpose, paidSum } = req.body;

    if (!paidById || !paidForId || !purpose || !paidSum) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const paidBy = users.find((user: User) => user.id === paidById);
    const paidFor = groups.find((group: Group) => group.id === paidForId);

    if (!paidBy) {
        return res.status(400).json({ error: "Invalid paidBy user" });
    }

    if (!paidFor) {
        return res.status(400).json({ error: "Invalid paidFor group" });
    }

    const newExpense: Expense = {
        id: uuidv4(),
        paidBy,
        paidFor,
        purpose,
        paidSum,
    };

    expenses.push(newExpense);

    res.status(201).json(newExpense);
});

router.get("/:id", (req, res) => {
    const userId = req.params.id;

    const paidByUser = expenses.filter((expense: Expense) => expense.paidBy.id === userId);

    const paidForUser = expenses.filter((expense: Expense) =>
        expense.paidFor.members.some((member: User) => member.id === userId) && expense.paidBy.id !== userId
    );

    res.json({ paidByUser, paidForUser });
});

export default router;
