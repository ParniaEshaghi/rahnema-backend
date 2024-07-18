import { Router } from 'express';
import { groups, expenses, Group, Expense, User } from '../index';

const router = Router();

router.get("/:id", (req, res) => {
    const groupId = req.params.id;

    const group = groups.find((group: Group) => group.id === groupId);

    if (!group) {
        return res.status(400).json({ message: 'Invalid group ID' });
    }

    const balances: { [userId: string]: number } = {};
    group.members.forEach((member: User) => {
        balances[member.id] = 0;
    });

    expenses.forEach((expense: Expense) => {
        if (expense.paidFor.id === groupId) {
            const amountPerMember = expense.paidSum / expense.paidFor.members.length;
            balances[expense.paidBy.id] += expense.paidSum;
            expense.paidFor.members.forEach((member: User) => {
                balances[member.id] -= amountPerMember;
            });
        }
    });

    const creditors: { userId: string, balance: number }[] = [];
    const debtors: { userId: string, balance: number }[] = [];

    for (const [userId, balance] of Object.entries(balances)) {
        if (balance > 0) {
            creditors.push({ userId, balance });
        } else if (balance < 0) {
            debtors.push({ userId, balance: -balance });
        }
    }

    const transactions = [];

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];

        const minAmount = Math.min(debtor.balance, creditor.balance);
        transactions.push({
            from: debtor.userId,
            to: creditor.userId,
            amount: parseFloat(minAmount.toFixed(2))
        });

        debtor.balance -= minAmount;
        creditor.balance -= minAmount;

        if (debtor.balance === 0) {
            debtors.shift();
        }

        if (creditor.balance === 0) {
            creditors.shift();
        }
    }

    res.json(transactions);
});

export default router;
