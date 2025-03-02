import { model, Schema } from 'mongoose';
import { IBike } from './product.interface';

const productSchema = new Schema<IBike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please enter bike name'],
      minlength: [3, 'Name must be at least 3 characters, get {VALUE}'],
      maxlength: [50, "Name can't exceed 40 characters, get {VALUE}"],
    },
    brand: {
      type: String,
      required: [true, 'Please enter bike brand'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ['Mountain', 'Road', 'Hybrid', 'Electric'],
        message:
          '{VALUE} is invalid category, Category must be either Mountain, Road, Hybrid, or Electric',
      },
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [
        10,
        'Description must be at least 10 characters, get {VALUE}',
      ],
    },
    model: {
      type: String,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: [0, 'Total Quantity must be a positive number'],
    },
    inStock: {
      type: Boolean,
      required: [true, 'Please specify if the product is in stock'],
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);
// Pre-save hook to update `inStock` based on `quantity`
productSchema.pre('save', function (next) {
  this.inStock = this.totalQuantity > 0;
  next();
});

//define and export the productSchema
const Product = model<IBike>('Product', productSchema);
export default Product;
