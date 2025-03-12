"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
// Schema for user object
const createUser = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            name: zod_1.z.string({ required_error: 'Name is required' }),
            email: zod_1.z.string(),
            phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
            password: zod_1.z
                .string()
                .max(20, { message: 'Password can not be more than 20 characters' }),
            role: zod_1.z.enum(['admin', 'landlord', 'tenant'], {
                message: 'Invalid role',
            }),
        }),
    }),
});
const updateUser = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
            email: zod_1.z.string().email({ message: 'Invalid email address' }).optional(),
            phoneNumber: zod_1.z
                .string({ required_error: 'Phone number is required' })
                .optional(),
            imageUrls: zod_1.z.string().optional(),
        }),
    }),
});
const changeActivityStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        isActive: zod_1.z.boolean(),
    }),
});
exports.UserValidation = {
    createUser,
    updateUser,
    changeActivityStatusValidationSchema,
};
