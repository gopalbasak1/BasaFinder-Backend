"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
// Schema for name object
const NameSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: 'First name is required' }).trim(),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().min(1, { message: 'Last name is required' }).trim(),
});
const UpdateNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1, { message: 'First name is required' })
        .trim()
        .optional(),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z
        .string()
        .min(1, { message: 'Last name is required' })
        .trim()
        .optional(),
});
// Schema for user object
const createUser = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            name: NameSchema,
            email: zod_1.z.string().email({ message: 'Invalid email address' }),
            password: zod_1.z
                .string()
                .max(20, { message: 'Password can not be more than 20 characters' }),
        }),
    }),
});
const updateUser = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.object({
            name: UpdateNameSchema.optional(),
            email: zod_1.z.string().email({ message: 'Invalid email address' }).optional(),
            image: zod_1.z.string().optional(),
        }),
    }),
});
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...user_constant_1.UserStatus]),
    }),
});
exports.UserValidation = {
    createUser,
    updateUser,
    changeStatusValidationSchema,
};
