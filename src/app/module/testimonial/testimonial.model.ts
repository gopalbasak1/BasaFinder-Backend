import mongoose, { model, Schema } from 'mongoose';
import { TTestimonial } from './textimonial.interface';

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

const Testimonial = model<TTestimonial>('Testimonial', testimonialSchema);
export default Testimonial;
