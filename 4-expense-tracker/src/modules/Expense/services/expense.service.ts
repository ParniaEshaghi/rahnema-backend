import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseDTO } from '../dtos/create-expense.dto';
import { NotFoundError } from '../../../utility/errors';
import { UserService } from '../../User/services/user.service';
import { GroupService } from '../../Group/services/group.service';
import { Expense } from '../models/expense.model';


export class ExpenseService {
    private expenseRepository: ExpenseRepository;
    private userService: UserService;
    private groupService: GroupService;

    constructor(
        expenseRepository: ExpenseRepository,
        userService: UserService,
        groupService: GroupService
    ) {
        this.expenseRepository = expenseRepository;
        this.userService = userService;
        this.groupService = groupService;
    }

    createExpense(createExpenseDTO: CreateExpenseDTO) {
        try {
            CreateExpenseDTO.parse(createExpenseDTO);
        } catch (error) {          
            throw error;
        }

        const { id, paidById, paidForId, purpose, paidSum } = createExpenseDTO;

        const paidBy = this.userService.findUserById(paidById);
        const paidFor = this.groupService.findGroupById(paidForId);

        if (!paidBy || !paidFor) {
            throw new NotFoundError;
        }

        const newExpense = new Expense(paidBy, paidFor, purpose, paidSum, id);

        this.expenseRepository.addExpense(newExpense);
        this.groupService.updateBalance(paidForId, newExpense);
        this.groupService.updateStatus(paidForId)

        return newExpense;
    }

    getUserExpenses(userId: string) {
        return this.expenseRepository.getExpensesByUser(userId);
    }
}
