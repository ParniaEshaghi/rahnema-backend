import request from 'supertest';
import express from 'express';
import { UserRepository } from '../../src/modules/User/repositories/user.repository';
import { GroupRepository } from '../../src/modules/Group/repositories/group.repository';
import { User } from '../../src/modules/User/models/user.model';
import { Group } from '../../src/modules/Group/models/group.model';
import { appMaker } from '../../src/app';
import { ExpenseRepository } from '../../src/modules/Expense/repositories/expense.repository';
import { UserService } from '../../src/modules/User/services/user.service';
import { GroupService } from '../../src/modules/Group/services/group.service';
import { ExpenseService } from '../../src/modules/Expense/services/expense.service';
import { JSONDatabase } from '../../src/database/JSON-database';
import { Expense } from '../../src/modules/Expense/models/expense.model';

describe('Expense End-to-End Tests', () => {
  let userRepository: UserRepository;
  let groupRepository: GroupRepository;
  let expenseRepository: ExpenseRepository;
  let userService: UserService;
  let groupService: GroupService;
  let expenseService: ExpenseService;
  let directoryUserDb: JSONDatabase<User>;
  let directoryGroupDb: JSONDatabase<Group>;
  let directoryExpenseDb: JSONDatabase<Expense>;
  let user: User;
  let group: Group;
  let app = express();
  let dirPath = "/home/parnia/repos/rahnema-backend/4-expense-tracker/src/data";

  beforeAll(() => {
    directoryUserDb = new JSONDatabase<User>(dirPath + '/users', 'user');
    directoryGroupDb = new JSONDatabase<Group>(dirPath + '/groups', 'group');
    directoryExpenseDb = new JSONDatabase<Expense>(dirPath + '/expenses', 'expense');

    // directoryUserDb.purge();
    // directoryGroupDb.purge();
    // directoryExpenseDb.purge();

    userRepository = new UserRepository(directoryUserDb);
    groupRepository = new GroupRepository(directoryGroupDb);
    expenseRepository = new ExpenseRepository(directoryExpenseDb);

    userService = new UserService(userRepository);
    groupService = new GroupService(groupRepository);
    expenseService = new ExpenseService(expenseRepository, userService, groupService);

    app = appMaker(groupService, expenseService);

    user = { id: '1', name: 'John Doe' };
    userService.createUser(user);
    
    group = {
      id: '1',
      name: 'Test Group',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    };
    groupService.createGroup(group);
  });

  it('should create an expense', async () => {
    const response = await request(app).post('/expense').send({
      paidById: '1',
      paidForId: '1',
      purpose: 'Lunch',
      paidSum: 100
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.purpose).toBe('Lunch');
  });

  it('should return error for invalid expense data', async () => {
    const response = await request(app).post('/expense').send({
      paidById: '',
      paidForId: '',
      purpose: '',
      paidSum: -100
    });
    expect(response.status).toBe(400);
  });

  it('should get user expenses', async () => {
    const response = await request(app).get('/expense/1');
    expect(response.status).toBe(200);
    expect(response.body.paidByUser.length).toBeGreaterThan(0);
  });
});


