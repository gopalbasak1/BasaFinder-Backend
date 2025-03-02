"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Zod schema for IBike
const productValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: 'Please enter bike name',
    })
        .min(3, 'Name must be at least 3 characters')
        .max(50, "Name can't exceed 50 characters"),
    brand: zod_1.z.string({
        required_error: 'Please enter bike brand',
    }),
    price: zod_1.z
        .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
    })
        .min(0, 'Price must be a positive number'),
    category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
        errorMap: () => ({
            message: 'Category must be either Mountain, Road, Hybrid, or Electric',
        }),
    }),
    description: zod_1.z
        .string({
        required_error: 'Please enter a description',
    })
        .min(10, 'Description must be at least 10 characters'),
    quantity: zod_1.z
        .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
    })
        .min(0, 'Quantity must be a positive number'),
    inStock: zod_1.z
        .boolean({
        required_error: 'Please specify if the product is in stock',
    })
        .optional(), // Optional because the database sets it automatically
});
// Export the validation schema
exports.default = productValidationSchema;
