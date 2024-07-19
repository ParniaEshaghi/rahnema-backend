export type User = {
    id: string;
    name: string;
}

export type MemberStatus = 'debtor' | 'creditor' | null;

export type Member = User & {
    groupId: string;
    balance: number;
    status: MemberStatus;
}

export type Group = {
    id: string;
    name: string;
    members: Member[];
}

export type Expense = {
    id: string;
    paidBy: User;
    paidFor: Group;
    purpose: string;
    paidSum: number;
}
