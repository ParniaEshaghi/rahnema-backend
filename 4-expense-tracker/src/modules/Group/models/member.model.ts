export type MemberStatus = 'debtor' | 'creditor' | 'balanced';

export type Member = {
    id: string;
    name: string;
    groupId: string;
    balance: number;
    status: MemberStatus;
};
