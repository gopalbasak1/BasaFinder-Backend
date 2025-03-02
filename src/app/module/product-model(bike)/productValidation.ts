import { z } from 'zod';

const createProduct = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(50, { message: "Name can't exceed 50 characters" }),

    brand: z
      .string({ required_error: 'Brand is required' })
      .min(1, { message: 'Brand is required' }),
    model: z
      .string({ required_error: 'Model is required' })
      .min(1, { message: 'Model is required' }),

    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .min(0, { message: 'Price must be a positive number' }),

    image: z
      .string({ required_error: 'Image is required' })
      .url({ message: 'Image must be a valid URL' })
      .optional(), // Make it optional to prevent validation failure

    category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
      message: 'Category must be one of Mountain, Road, Hybrid, or Electric',
    }),

    description: z
      .string({ required_error: 'Description is required' })
      .min(10, { message: 'Description must be at least 10 characters' }),

    totalQuantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, { message: 'Quantity must be a positive number' }),
  }),
});

const updateProduct = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(50, { message: "Name can't exceed 50 characters" })
      .optional(),

    brand: z
      .string({ required_error: 'Brand is required' })
      .min(1, { message: 'Brand is required' })
      .optional(),
    model: z
      .string({ required_error: 'Model is required' })
      .min(1, { message: 'Model is required' })
      .optional(),

    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .min(0, { message: 'Price must be a positive number' })
      .optional(),

    image: z
      .string({ required_error: 'Image is required' })
      .url({ message: 'Image must be a valid URL' })
      .optional(), // Make it optional to prevent validation failure

    category: z
      .enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
        message: 'Category must be one of Mountain, Road, Hybrid, or Electric',
      })
      .optional(),

    description: z
      .string({ required_error: 'Description is required' })
      .min(10, { message: 'Description must be at least 10 characters' })
      .optional(),

    totalQuantity: z
      .number({
        required_error: 'Total Quantity is required',
        invalid_type_error: 'Total Quantity must be a number',
      })
      .min(0, { message: 'Total Quantity must be a positive number' })
      .optional(),
  }),
});

export const ProductValidation = {
  createProduct,
  updateProduct,
};
