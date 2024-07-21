import request from 'supertest';
import app from '../src/index';
import { users, groups, expenses } from '../src/index';

describe('Expense Test', () => {
    beforeAll(() => {
        users.length = 0;
        groups.length = 0;
        expenses.length = 0;

        users.push({ id: '1', name: 'Alice' });
        users.push({ id: '2', name: 'Bob' });
        users.push({ id: '3', name: 'Charlie' });

        groups.push({
            id: '1',
            name: 'Group1',
            members: users.map(user => ({ ...user, groupId: '1', balance: 0, status: null }))
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
    });


    describe('POST /expense', () => {
        it('should create a new expense', async () => {
            const response = await request(app)
                .post('/expense')
                .send({
                    paidById: '1',
                    paidForId: '1',
                    purpose: 'Dinner',
                    paidSum: 100
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.paidBy.id).toBe('1');
            expect(response.body.paidFor.id).toBe('1');
            expect(response.body.purpose).toBe('Dinner');
            expect(response.body.paidSum).toBe(100);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/expense')
                .send({
                    paidById: '1',
                    paidForId: '1',
                    purpose: 'Dinner'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields');
        });

        it('should return 400 if paidBy user or paidFor group are invalid', async () => {
            const response = await request(app)
                .post('/expense')
                .send({
                    paidById: '999',
                    paidForId: '1',
                    purpose: 'Dinner',
                    paidSum: 100
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid user or group');
        });
    });

    describe('GET /expense/:id', () => {
        it('should return expenses paid by the user and paid for the user', async () => {
            const response = await request(app)
                .get('/expense/1');

            expect(response.status).toBe(200);
            expect(response.body.paidByUser.length).toBe(2);
            expect(response.body.paidByUser[0].paidBy.id).toBe('1');
            expect(response.body.paidByUser[0].purpose).toBe('Lunch');
            expect(response.body.paidByUser[0].paidSum).toBe(90);

            expect(response.body.paidForUser.length).toBe(1);
            expect(response.body.paidForUser[0].purpose).toBe('Coffee');
        });

        it('should return empty arrays if the user has no expenses', async () => {
            const response = await request(app)
                .get('/expense/4');

            expect(response.status).toBe(200);
            expect(response.body.paidByUser).toEqual([]);
            expect(response.body.paidForUser).toEqual([]);
        });
    });
});
