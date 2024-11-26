import { z } from 'zod';

export const CreatePermissionSchema = z.object({
  name: z
    .string({
      required_error: 'Permission name is required',
    })
    .min(1, { message: 'Permission name is required' })
    .max(50, { message: 'Permission name must be less than 50 characters' }),

  type: z
    .string({
      required_error: 'Permission type is required',
    })
    .min(1, { message: 'Permission type is required' })
    .max(20, { message: 'Permission type must be less than 20 characters' }),

  category: z
    .string({
      required_error: 'Category is required',
    })
    .min(1, { message: 'Category is required' })
    .max(50, { message: 'Category must be less than 50 characters' }),

  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, { message: 'Description is required' })
    .max(255, { message: 'Description cannot exceed 255 characters' }),
});
