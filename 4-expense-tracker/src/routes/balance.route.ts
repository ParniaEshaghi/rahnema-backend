import { Router } from 'express';
import { groups } from '../index';
import { Group, Member } from '../types';

const router = Router();

router.get("/:id", (req, res) => {
    const groupId = req.params.id;

    const group = groups.find((group: Group) => group.id === groupId);

    if (!group) {
        return res.status(400).json({ message: 'Invalid group ID' });
    }

    const creditors: Member[] = [];
    const debtors: Member[] = [];

    group.members.forEach((member: Member) => {
        if (member.status === 'creditor') {
            creditors.push(member);
        } else if (member.status === 'debtor') {
            debtors.push(member);
        }
    });

    const transactions = [];

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];

        const minAmount = Math.min(-debtor.balance, creditor.balance);
        transactions.push({
            from: debtor.id,
            to: creditor.id,
            amount: parseFloat(minAmount.toFixed(2))
        });

        debtor.balance -= minAmount;
        creditor.balance -= minAmount;

        if (debtor.balance === 0) {
            debtor.status = null;
            debtors.shift();
        }

        if (creditor.balance === 0) {
            creditor.status = null;
            creditors.shift();
        }
    }

    res.json(transactions);
});

export default router;
