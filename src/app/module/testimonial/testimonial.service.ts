import testimonial from './testimonial.model';
import AppError from '../../errors/AppErrors';
import { User } from '../user/user.model';
import { TTestimonial } from './textimonial.interface';
import Testimonial from './testimonial.model';
import QueryBuilder from '../../builder/QueryBuilder';
import httpStatus from 'http-status-codes';
/**
 * Create a testimonial
 */
const createTestimonial = async (email: string, payload: TTestimonial) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  if (user.role === 'landlord') {
    throw new AppError(httpStatus.FORBIDDEN, 'Landlord not permitted');
  }

  const newTestimonial = await testimonial.create({
    ...payload,
    user: user._id,
  });

  return newTestimonial;
};

/**
 * Get all testimonials
 */
const getAllTestimonials = async (query: Record<string, unknown>) => {
  const baseQuery = new QueryBuilder(
    Testimonial.find().populate('user'),
    query,
  );

  const result = await baseQuery.modelQuery;
  const meta = await baseQuery.countTotal();
  return { result, meta };
};

/**
 * Delete a testimonial (Admin Only)
 */
const deleteTestimonial = async (testimonialId: string) => {
  const testimonial = await Testimonial.findById(testimonialId);
  if (!testimonial) throw new AppError(404, 'testimonial not found');

  await Testimonial.findByIdAndDelete(testimonialId);
  return { message: 'testimonial deleted successfully' };
};

export const testimonialServices = {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
};
