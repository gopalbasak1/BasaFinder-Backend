import { Types } from 'mongoose';

export interface TTestimonial extends Document {
  user: Types.ObjectId;
  message: string;
  rating: number;
}
