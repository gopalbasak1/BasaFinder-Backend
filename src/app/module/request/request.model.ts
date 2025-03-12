// rentalRequest.model.ts
import { model, Schema } from 'mongoose';
import { IRentalRequest } from './request.interface';

const rentalRequestSchema = new Schema<IRentalRequest>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'RentalListing', // Reference to Rental Listing
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User (Tenant)
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    landlordPhone: {
      type: String,
    },
    moveInDate: { type: Date },
    rentalDuration: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    message: {
      type: String,
      required: true,
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

export const RentalRequest = model<IRentalRequest>(
  'RentalRequest',
  rentalRequestSchema,
);
