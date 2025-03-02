import { Types } from 'mongoose';

export interface IBike {
  name: string;
  brand: string;
  price: number;
  model?: string;
  image: string;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  totalQuantity: number;
  inStock?: boolean;
  user?: string | Types.ObjectId;
}
