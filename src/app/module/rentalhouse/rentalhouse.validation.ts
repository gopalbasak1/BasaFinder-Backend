import { z } from 'zod';
import { Districts, Divisions } from './rentalhouse.constant';

const createRentalListingValidationSchema = z.object({
  body: z.object({
    holding: z.string().min(1, 'Holding name is required'),
    address: z.string().min(1, 'Address is required'),
    district: z.enum([...Districts] as [string, ...string[]]),

    unitNumber: z.string().min(1, 'Unit number is required'),
    postalCode: z.number().optional(),
    upazila: z.string().optional(),
    citycorporation: z.string().optional(),
    division: z.enum([...Divisions] as [string, ...string[]]),
    country: z.string().default('Bangladesh'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long'),
    rentAmount: z.number().min(1, 'Rent amount must be greater than 0'),
    bedrooms: z.number().min(1, 'Bedrooms must be at least 1'),
    category: z.enum(['family', 'bachelor'], {
      errorMap: () => ({
        message: 'Category must be either "family" or "bachelor"',
      }),
    }),
    isAvailable: z.boolean().default(true),
    reviews: z.array(z.string()).optional(),
    ratingCount: z.number().default(0),
    averageRating: z.number().default(0),
    specification: z.record(z.any()).optional(),
    keyFeatures: z.array(z.string()).optional(),
  }),
});

const updateRentalListingValidationSchema = z.object({
  body: z.object({
    holding: z.string().min(1, 'Holding name is required'),
    address: z.string().min(1, 'Address is required'),
    district: z.enum([...Districts] as [string, ...string[]]),

    unitNumber: z.string().min(1, 'Unit number is required'),
    postalCode: z.number().optional(),
    upazila: z.string().optional(),
    citycorporation: z.string().optional(),
    division: z.enum([...Divisions] as [string, ...string[]]),
    country: z.string().default('Bangladesh'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters long'),
    rentAmount: z.number().min(1, 'Rent amount must be greater than 0'),
    bedrooms: z.number().min(1, 'Bedrooms must be at least 1'),
    category: z.enum(['family', 'bachelor'], {
      errorMap: () => ({
        message: 'Category must be either "family" or "bachelor"',
      }),
    }),
    isAvailable: z.boolean().default(true),
    reviews: z.array(z.string()).optional(),
    ratingCount: z.number().default(0),
    averageRating: z.number().default(0),
    specification: z.record(z.any()).optional(),
    keyFeatures: z.array(z.string()).optional(),
  }),
});

export const RentalHouseValidation = {
  createRentalListingValidationSchema,
  updateRentalListingValidationSchema,
};
