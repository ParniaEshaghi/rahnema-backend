import { v4 as uuidv4 } from 'uuid';
import { User } from '../../User/models/user.model';
import { Group } from '../../Group/models/group.model';

export class Expense {
    id: string;
    paidBy: User;
    paidFor: Group;
    purpose: string;
    paidSum: number;

    constructor(paidBy: User, paidFor: Group, purpose: string, paidSum: number, id?: string) {
        this.id = id || uuidv4();
        this.paidBy = paidBy;
        this.paidFor = paidFor;
        this.purpose = purpose;
        this.paidSum = paidSum;
    }
}
