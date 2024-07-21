import request from 'supertest';
import app from '../src/index';
import { users, groups, expenses } from '../src/index';
import { updateBalance, updateStatus } from '../src/routes/expense.route';

describe('Balance Test', () => {
    beforeAll(async () => {
        users.length = 0;
        groups.length = 0;

        users.push({ id: '1', name: 'Alice' });
        users.push({ id: '2', name: 'Bob' });
        users.push({ id: '3', name: 'Charlie' });

        groups.push({
            id: '1',
            name: 'Group1',
            members: [
                { id: '1', name: 'Alice', groupId: '1', balance: 0, status: null },
                { id: '2', name: 'Bob', groupId: '1', balance: 0, status: null },
                { id: '3', name: 'Charlie', groupId: '1', balance: 0, status: null }
            ]
        });

        expenses.push({
            id: 'e1',
            paidBy: users[0],
            paidFor: groups[0],
            purpose: 'Lunch',
            paidSum: 90
        });

        expenses.push({
            id: 'e2',
            paidBy: users[1],
            paidFor: groups[0],
            purpose: 'Coffee',
            paidSum: 60
        });

        expenses.forEach(updateBalance)
        expenses.forEach(updateStatus)
    });


    describe('GET /balance/:id', () => {
        it('should return the minimum transactions to settle balances for a valid group', async () => {
            const response = await request(app)
                .get('/balance/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { from: '3', to: '1', amount: 40 },
                { from: '3', to: '2', amount: 10 }
            ]);
        });

        it('should return an error for an invalid group ID', async () => {
            const response = await request(app)
                .get('/balance/999');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Invalid group ID' });
        });

        it('should return no transactions if the group has no expenses', async () => {
            groups.push({
                id: '2',
                name: 'Group2',
                members: [
                    { id: '1', name: 'Alice', groupId: '2', balance: 0, status: null },
                    { id: '2', name: 'Bob', groupId: '2', balance: 0, status: null }
                ]
            });

            const response = await request(app)
                .get('/balance/2');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
