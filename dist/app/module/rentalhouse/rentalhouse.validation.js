"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalHouseValidation = void 0;
const zod_1 = require("zod");
const rentalhouse_constant_1 = require("./rentalhouse.constant");
const createRentalListingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        holding: zod_1.z.string().min(1, 'Holding name is required'),
        address: zod_1.z.string().min(1, 'Address is required'),
        district: zod_1.z.enum([...rentalhouse_constant_1.Districts]),
        unitNumber: zod_1.z.string().min(1, 'Unit number is required'),
        postalCode: zod_1.z.number().optional(),
        upazila: zod_1.z.string().optional(),
        citycorporation: zod_1.z.string().optional(),
        division: zod_1.z.enum([...rentalhouse_constant_1.Divisions]),
        country: zod_1.z.string().default('Bangladesh'),
        description: zod_1.z
            .string()
            .min(10, 'Description must be at least 10 characters long'),
        rentAmount: zod_1.z.number().min(1, 'Rent amount must be greater than 0'),
        bedrooms: zod_1.z.number().min(1, 'Bedrooms must be at least 1'),
        category: zod_1.z.enum(['family', 'bachelor'], {
            errorMap: () => ({
                message: 'Category must be either "family" or "bachelor"',
            }),
        }),
        isAvailable: zod_1.z.boolean().default(true),
        reviews: zod_1.z.array(zod_1.z.string()).optional(),
        ratingCount: zod_1.z.number().default(0),
        averageRating: zod_1.z.number().default(0),
        specification: zod_1.z.record(zod_1.z.any()).optional(),
        keyFeatures: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateRentalListingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        holding: zod_1.z.string().min(1, 'Holding name is required'),
        address: zod_1.z.string().min(1, 'Address is required'),
        district: zod_1.z.enum([...rentalhouse_constant_1.Districts]),
        unitNumber: zod_1.z.string().min(1, 'Unit number is required'),
        postalCode: zod_1.z.number().optional(),
        upazila: zod_1.z.string().optional(),
        citycorporation: zod_1.z.string().optional(),
        division: zod_1.z.enum([...rentalhouse_constant_1.Divisions]),
        country: zod_1.z.string().default('Bangladesh'),
        description: zod_1.z
            .string()
            .min(10, 'Description must be at least 10 characters long'),
        rentAmount: zod_1.z.number().min(1, 'Rent amount must be greater than 0'),
        bedrooms: zod_1.z.number().min(1, 'Bedrooms must be at least 1'),
        category: zod_1.z.enum(['family', 'bachelor'], {
            errorMap: () => ({
                message: 'Category must be either "family" or "bachelor"',
            }),
        }),
        isAvailable: zod_1.z.boolean().default(true),
        reviews: zod_1.z.array(zod_1.z.string()).optional(),
        ratingCount: zod_1.z.number().default(0),
        averageRating: zod_1.z.number().default(0),
        specification: zod_1.z.record(zod_1.z.any()).optional(),
        keyFeatures: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.RentalHouseValidation = {
    createRentalListingValidationSchema,
    updateRentalListingValidationSchema,
};
