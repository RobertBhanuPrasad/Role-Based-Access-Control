import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z
    .string({
      required_error: 'Role name is required',
    })
    .min(1, { message: 'Role name is required' })
    .max(50, { message: 'Role name must be less than 50 characters' }),

  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, { message: 'Description is required' })
    .max(255, { message: 'Description cannot exceed 255 characters' }),
});
