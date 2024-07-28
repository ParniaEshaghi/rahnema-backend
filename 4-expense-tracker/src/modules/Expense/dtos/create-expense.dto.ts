import { z } from 'zod';

export const CreateExpenseDTO = z.object({
    id: z.string().min(1).optional(),
    paidById: z.string().min(1, 'PaidById is required'),
    paidForId: z.string().min(1, 'PaidForId is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    paidSum: z.number().min(0, 'PaidSum must be greater than or equal to 0')
});

export type CreateExpenseDTO = z.infer<typeof CreateExpenseDTO>;
