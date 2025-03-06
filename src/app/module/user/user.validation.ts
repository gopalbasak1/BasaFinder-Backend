import { z } from 'zod';

// Schema for user object
const createUser = z.object({
  body: z.object({
    user: z.object({
      name: z.string({ required_error: 'Name is required' }),
      email: z.string(),
      phoneNumber: z.string({ required_error: 'Phone number is required' }),
      password: z
        .string()
        .max(20, { message: 'Password can not be more than 20 characters' }),
      role: z.enum(['admin', 'landlord', 'tenant'], {
        message: 'Invalid role',
      }),
    }),
  }),
});

const updateUser = z.object({
  body: z.object({
    user: z.object({
      name: z.string({ required_error: 'Name is required' }).optional(),
      email: z.string().email({ message: 'Invalid email address' }).optional(),
      phoneNumber: z
        .string({ required_error: 'Phone number is required' })
        .optional(),
      image: z.string().optional(),
    }),
  }),
});

const changeActivityStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
  changeActivityStatusValidationSchema,
};
