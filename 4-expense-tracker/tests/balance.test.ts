import request from 'supertest';
import app from '../src/index';
import { server } from '../src/server';
import { User, Group, Expense, users, groups, expenses } from '../src/index';

beforeAll(() => {
    (users as User[]).length = 0;
    (groups as Group[]).length = 0;
    (expenses as Expense[]).length = 0;

    users.push({ id: '1', name: 'Alice' });
    users.push({ id: '2', name: 'Bob' });
    users.push({ id: '3', name: 'Charlie' });

    groups.push({ id: '1', name: 'Group1', members: users });

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
});

afterAll((done) => {
    server.close(done);
});

describe('GET /balance/:id', () => {
    it('should return the minimum transactions to settle balances for a valid group', async () => {
        const response = await request(app)
            .get('/balance/1');

        console.log('Response Body:', response.body);

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
        groups.push({ id: '2', name: 'Group2', members: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }] });

        const response = await request(app)
            .get('/balance/2');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]); 
    });
});
