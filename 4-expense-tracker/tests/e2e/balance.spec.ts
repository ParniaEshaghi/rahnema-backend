import request from 'supertest';
import express from 'express';
import { UserRepository } from '../../src/modules/User/repositories/user.repository';
import { GroupRepository } from '../../src/modules/Group/repositories/group.repository';
import { ExpenseRepository } from '../../src/modules/Expense/repositories/expense.repository';
import { ExpenseService } from '../../src/modules/Expense/services/expense.service';
import { User } from '../../src/modules/User/models/user.model';
import { Group } from '../../src/modules/Group/models/group.model';
import { UserService } from '../../src/modules/User/services/user.service';
import { GroupService } from '../../src/modules/Group/services/group.service';
import { appMaker } from '../../src/app';
import { JSONDatabase } from '../../src/database/JSON-database';
import { Expense } from '../../src/modules/Expense/models/expense.model';

describe('Balance End-to-End Tests', () => {
  let userRepository: UserRepository;
  let groupRepository: GroupRepository;
  let expenseRepository: ExpenseRepository;
  let expenseService: ExpenseService;
  let userService: UserService;
  let groupService: GroupService;
  let directoryUserDb: JSONDatabase<User>;
  let directoryGroupDb: JSONDatabase<Group>;
  let directoryExpenseDb: JSONDatabase<Expense>;
  let user: User;
  let user2: User;
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
    user2 = { id: '2', name: 'Jane Doe' };
    userService.createUser(user);
    userService.createUser(user2);

    group = {
      id: '1',
      name: 'Test Group',
      members: [
        { id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' },
        { id: '2', name: 'Jane Doe', groupId: '1', balance: 0, status: 'balanced' }
      ]
    };
    groupService.createGroup(group);

    expenseService.createExpense({
      paidById: '1',
      paidForId: '1',
      purpose: 'Dinner',
      paidSum: 100
    });

  });

  it('should get group transactions', async () => {
    const response = await request(app).get('/balance/1');
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should return error for invalid group id', async () => {
    const response = await request(app).get('/balance/nonexistent-id');
    console.log(response.body)
    expect(response.status).toBe(404);
  });
});

