import { Types } from 'mongoose';

// Order Interface
type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface iOrder {
  user?: string;
  product: Types.ObjectId;
  orderQuantity: number;
  totalPrice?: number;
  orderStatus: OrderStatus;
  estimatedDeliveryDate?: Date;
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
