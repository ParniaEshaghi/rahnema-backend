import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { users, groups, expenses } from '../index';
import { User, Group, Expense, Member } from '../types';

const router = Router();

router.post("/", (req, res) => {
    const { paidById, paidForId, purpose, paidSum } = req.body;

    if (!paidById || !paidForId || !purpose || !paidSum) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const paidBy = users.find((user: User) => user.id === paidById);
    const paidFor = groups.find((group: Group) => group.id === paidForId);

    if (!paidBy || !paidFor) {
        return res.status(400).json({ error: "Invalid user or group" });
    }

    const newExpense: Expense = {
        id: uuidv4(),
        paidBy,
        paidFor,
        purpose,
        paidSum,
    };

    expenses.push(newExpense);

    updateBalance(newExpense);
    updateStatus(newExpense);

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


export const updateBalance = ((expense: Expense): void => {
    const amountPerMember = expense.paidSum / expense.paidFor.members.length;
    expense.paidFor.members.forEach((member: Member) => {
        if (member.id === expense.paidBy.id) {
            member.balance += expense.paidSum - amountPerMember;
        } else {
            member.balance -= amountPerMember;
        }
    });
});

export const updateStatus = (({ paidFor }: Expense): void => {
    paidFor.members.forEach((member: Member) => {
        member.status = member.balance > 0 ? 'creditor' : member.balance < 0 ? 'debtor' : null;
    });
});
