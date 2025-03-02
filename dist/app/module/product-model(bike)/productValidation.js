"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProduct = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, { message: 'Name must be at least 3 characters' })
            .max(50, { message: "Name can't exceed 50 characters" }),
        brand: zod_1.z
            .string({ required_error: 'Brand is required' })
            .min(1, { message: 'Brand is required' }),
        model: zod_1.z
            .string({ required_error: 'Model is required' })
            .min(1, { message: 'Model is required' }),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
            .min(0, { message: 'Price must be a positive number' }),
        image: zod_1.z
            .string({ required_error: 'Image is required' })
            .url({ message: 'Image must be a valid URL' })
            .optional(), // Make it optional to prevent validation failure
        category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
            message: 'Category must be one of Mountain, Road, Hybrid, or Electric',
        }),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .min(10, { message: 'Description must be at least 10 characters' }),
        totalQuantity: zod_1.z
            .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
            .min(0, { message: 'Quantity must be a positive number' }),
    }),
});
const updateProduct = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, { message: 'Name must be at least 3 characters' })
            .max(50, { message: "Name can't exceed 50 characters" })
            .optional(),
        brand: zod_1.z
            .string({ required_error: 'Brand is required' })
            .min(1, { message: 'Brand is required' })
            .optional(),
        model: zod_1.z
            .string({ required_error: 'Model is required' })
            .min(1, { message: 'Model is required' })
            .optional(),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
            .min(0, { message: 'Price must be a positive number' })
            .optional(),
        image: zod_1.z
            .string({ required_error: 'Image is required' })
            .url({ message: 'Image must be a valid URL' })
            .optional(), // Make it optional to prevent validation failure
        category: zod_1.z
            .enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
            message: 'Category must be one of Mountain, Road, Hybrid, or Electric',
        })
            .optional(),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .min(10, { message: 'Description must be at least 10 characters' })
            .optional(),
        totalQuantity: zod_1.z
            .number({
            required_error: 'Total Quantity is required',
            invalid_type_error: 'Total Quantity must be a number',
        })
            .min(0, { message: 'Total Quantity must be a positive number' })
            .optional(),
    }),
});
exports.ProductValidation = {
    createProduct,
    updateProduct,
};
