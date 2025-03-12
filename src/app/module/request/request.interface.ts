// rentalRequest.interface.ts
import { Document, Types } from 'mongoose';

export type RentalRequestStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid';

export interface IRentalRequest extends Document {
  listingId: Types.ObjectId;
  tenantId: Types.ObjectId;
  status: RentalRequestStatus;
  landlordPhone?: string; // Landlord's phone number (set upon approval)
  paymentStatus?: PaymentStatus;
  message: string; // Detailed text (move-in dates, rental duration, special requirements)
  rentalDuration: number;
  moveInDate?: Date;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}
