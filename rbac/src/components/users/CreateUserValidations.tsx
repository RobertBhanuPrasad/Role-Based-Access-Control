import { z } from "zod";

export const CreateUserValidationSchema = z.object({
  // Username validation
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, {
      message: "Username cannot be longer than 20 characters",
    }),

  // Email validation
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email format" }),

  // Password validation
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, {
      message: "Password cannot be longer than 32 characters",
    })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),

  // Role validation
  role: z
    .enum(["admin", "editor", "viewer"], {
      required_error: "Role is required",
    })
    .refine((role) => role !== "", {
      message: "Invalid role selected",
    }),

  // Status validation
  status: z
    .boolean({
      required_error: "Status is required",
    })
    .optional(),

  // Phone number validation
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, {
      message: "Invalid phone number format",
    })
    .optional(),

  // Address validation
  address: z
    .string()
    .max(255, { message: "Address cannot be longer than 255 characters" })
    .optional(),
});
