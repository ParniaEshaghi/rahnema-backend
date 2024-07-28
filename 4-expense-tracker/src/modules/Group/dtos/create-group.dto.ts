import { z } from 'zod';

export const CreateGroupDTO = z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1, 'Name is required'),
    members: z.array(
        z.object({
            id: z.string().min(1),
            name: z.string().min(1),
            groupId: z.string().min(1),
            balance: z.number(),
            status: z.enum(['debtor', 'creditor', 'balanced'])
        })
    )
});

export type CreateGroupDTO = z.infer<typeof CreateGroupDTO>;
