import { z } from 'zod';

export const CreateUserDTO = z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1, 'Name is required')
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;
