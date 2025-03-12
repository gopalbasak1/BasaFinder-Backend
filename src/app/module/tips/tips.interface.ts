import { Document, Types } from 'mongoose';

export interface TTips extends Document {
  user: Types.ObjectId;
  title: string;
  content: number;
}
