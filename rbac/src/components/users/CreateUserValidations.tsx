import { z } from 'zod';

export const CreateUserSchema = z.object({
  first_name: z
    .string({
      required_error: 'First name is required',
    })
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must be less than 50 characters' }),

  last_name: z
    .string({
      required_error: 'Last name is required',
    })
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must be less than 50 characters' }),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password is required',

    })
    .nonempty({
        message: 'Password is required',
      })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password cannot exceed 100 characters' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),

  status:z.string({
    required_error: "Status required",
    invalid_type_error: "Status required",
  }),


  // role :z
  // .array(
  //   z.string({
  //     required_error: "Role required"
  //   })
  // )
  // .nonempty({
  //   message: "Role required",
  // }),


  // permissions :z
  // .array(
  //   z.string({
  //     required_error: "Permission is required"
  //   })
  // )
  // .nonempty({
  //   message: "Permission is required",
  // }),

  user_code: z
    .string({
      required_error: 'User code is required',
    })
    .min(3, { message: 'User code must be at least 3 characters long' })
    .max(20, { message: 'User code cannot exceed 20 characters' }),

  address: z
    .string({
      required_error: 'Address is required',
    })
    .min(1, { message: 'Address is required' })
    .max(255, { message: 'Address cannot exceed 255 characters' }),

  phone_number: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?\d{10,15}$/, { message: 'Phone number must be a valid international number' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number cannot exceed 15 digits' }),
});
