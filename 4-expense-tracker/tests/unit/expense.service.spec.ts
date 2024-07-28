import { InMemoryDatabase } from "../../src/database/in-memory-database";
import { CreateExpenseDTO } from "../../src/modules/Expense/dtos/create-expense.dto";
import { Expense } from "../../src/modules/Expense/models/expense.model";
import { ExpenseRepository } from "../../src/modules/Expense/repositories/expense.repository";
import { ExpenseService } from "../../src/modules/Expense/services/expense.service";
import { Group } from "../../src/modules/Group/models/group.model";
import { GroupRepository } from "../../src/modules/Group/repositories/group.repository";
import { GroupService } from "../../src/modules/Group/services/group.service";
import { User } from "../../src/modules/User/models/user.model";
import { UserRepository } from "../../src/modules/User/repositories/user.repository";
import { UserService } from "../../src/modules/User/services/user.service";
import { NotFoundError } from "../../src/utility/errors";


describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let userService: UserService;
  let groupService: GroupService;
  let expenseRepository: ExpenseRepository;
  let userRepository: UserRepository;
  let groupRepository: GroupRepository;
  let inMemoryUsers: InMemoryDatabase<User>;
  let inMemoryGroups: InMemoryDatabase<Group>;
  let inMemoryExpenses: InMemoryDatabase<Expense>;

  beforeEach(() => {
    inMemoryUsers = new InMemoryDatabase();
    inMemoryGroups = new InMemoryDatabase();
    inMemoryExpenses = new InMemoryDatabase();

    expenseRepository = new ExpenseRepository(inMemoryExpenses);
    userRepository = new UserRepository(inMemoryUsers);
    groupRepository = new GroupRepository(inMemoryGroups);

    userService = new UserService(userRepository);
    groupService = new GroupService(groupRepository)

    expenseService = new ExpenseService(expenseRepository, userService, groupService);
  });

  it('should create an expense', () => {
    const user = userRepository.addUser({ id: '1', name: 'John Doe' });
    const group = groupRepository.addGroup({
      id: '1',
      name: 'Test Group',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    });
    const expenseDTO: CreateExpenseDTO = {
      paidById: '1',
      paidForId: '1',
      purpose: 'Lunch',
      paidSum: 100
    };
    const expense = expenseService.createExpense(expenseDTO);
    expect(expense).toHaveProperty('id');
    expect(expense.purpose).toBe('Lunch');
  });

  it('should throw error when creating an expense with invalid data', () => {
    const expenseDTO: any = {
      paidById: '',
      paidForId: '',
      purpose: '',
      paidSum: -100
    };
    expect(() => expenseService.createExpense(expenseDTO)).toThrow();
  });

  it('should throw NotFoundError if user or group is not found', () => {
    const expenseDTO: CreateExpenseDTO = {
      paidById: 'nonexistent-user',
      paidForId: 'nonexistent-group',
      purpose: 'Lunch',
      paidSum: 100
    };
    expect(() => expenseService.createExpense(expenseDTO)).toThrow(NotFoundError);
  });

  it('should return expenses for a user', () => {
    const user = userRepository.addUser({ id: '1', name: 'John Doe' });
    const group = groupRepository.addGroup({
      id: '1',
      name: 'Test Group',
      members: [{ id: '1', name: 'John Doe', groupId: '1', balance: 0, status: 'balanced' }]
    });
    const expenseDTO: CreateExpenseDTO = {
      paidById: '1',
      paidForId: '1',
      purpose: 'Lunch',
      paidSum: 100
    };
    expenseService.createExpense(expenseDTO);
    const expenses = expenseService.getUserExpenses('1');
    expect(expenses.paidByUser.length).toBe(1);
  });
});
