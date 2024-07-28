// main.ts
import { appMaker } from './app';
import { GroupService } from './modules/Group/services/group.service';
import { GroupRepository } from './modules/Group/repositories/group.repository';
import { UserRepository } from './modules/User/repositories/user.repository';
import { ExpenseRepository } from './modules/Expense/repositories/expense.repository';
import { ExpenseService } from './modules/Expense/services/expense.service';
import { UserService } from './modules/User/services/user.service';
import { JSONDatabase } from './database/JSON-database';
import { User } from './modules/User/models/user.model';
import { Group } from './modules/Group/models/group.model';
import { Expense } from './modules/Expense/models/expense.model';

// Create database instances
const directoryUserDb = new JSONDatabase<User>('/src/data/users', 'user');
const directoryGroupDb = new JSONDatabase<Group>('/src/data/groups', 'group');
const directoryExpenseDb = new JSONDatabase<Expense>('/src/data/expenses', 'expense');

// Create repository instances with the database instances
const userRepository = new UserRepository(directoryUserDb);
const groupRepository = new GroupRepository(directoryGroupDb);
const expenseRepository = new ExpenseRepository(directoryExpenseDb);

// Create service instances with the repository instances
const userService = new UserService(userRepository);
const groupService = new GroupService(groupRepository);
const expenseService = new ExpenseService(expenseRepository, userService, groupService);

// Create and configure the app
const app = appMaker(groupService, expenseService);

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
