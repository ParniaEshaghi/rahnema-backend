import { GroupRepository } from '../repositories/group.repository';
import { Member } from '../models/member.model';
import { CreateGroupDTO } from '../dtos/create-group.dto';
import { NotFoundError } from '../../../utility/errors';
import { Group } from '../models/group.model';
import { Expense } from '../../Expense/models/expense.model';

export class GroupService {
    private groupRepository: GroupRepository;

    constructor(groupRepository: GroupRepository) {
        this.groupRepository = groupRepository;
    }

    findGroupById(id: string): Group | undefined {

        const group = this.groupRepository.findGroupById(id);

        if (!group) {
            throw new NotFoundError;
        }
        return group;
    }

    getGroupMembers(groupId: string) {
        const group = this.findGroupById(groupId);
        if (!group) {
            throw new NotFoundError;
        }
        return group.members;
    }

    getGroupTransactions(groupId: string) {
        const group = this.findGroupById(groupId);
        if (!group) {
            throw new NotFoundError;
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
                debtor.status = 'balanced';
                debtors.shift();
            }

            if (creditor.balance === 0) {
                creditor.status = 'balanced';
                creditors.shift();
            }
        }

        return transactions;
    }

    createGroup(createGroupDTO: CreateGroupDTO) {
        try {
            CreateGroupDTO.parse(createGroupDTO);
        } catch (error) {          
            throw error;
        }

        const { id, name, members } = createGroupDTO;

        const newGroup = new Group(name, members, id);

        this.groupRepository.addGroup(newGroup);

        return newGroup;
    }

    getGroups(){
        return this.groupRepository.getGroups();
    }

    updateBalance = (groupId: string, expense: Expense): void => {
        const members = this.getGroupMembers(groupId);
        const amountPerMember = expense.paidSum / members.length;
        members.forEach((member: Member) => {
            if (member.id === expense.paidBy.id) {
                member.balance += expense.paidSum - amountPerMember;
            } else {
                member.balance -= amountPerMember;
            }
        });
    }
    
    updateStatus = (groupId: string): void => {
        const members = this.getGroupMembers(groupId);
        members.forEach((member: Member) => {
            member.status = member.balance > 0 ? 'creditor' : member.balance < 0 ? 'debtor' : 'balanced';
        });
    }
}
