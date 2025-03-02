import Review from './review.model';
import { TReview } from './review.interface';
import AppError from '../../errors/AppErrors';
import { User } from '../user/user.model';

/**
 * Create a review
 */
const createReview = async (email: string, payload: TReview) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const newReview = await Review.create({
    ...payload,
    user: user._id,
  });

  return newReview;
};

/**
 * Get all reviews
 */
const getAllReviews = async () => {
  return await Review.find().populate('user', 'name email image');
};

/**
 * Delete a review (Admin Only)
 */
const deleteReview = async (reviewId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new AppError(404, 'Review not found');

  await Review.findByIdAndDelete(reviewId);
  return { message: 'Review deleted successfully' };
};

export const reviewServices = {
  createReview,
  getAllReviews,
  deleteReview,
};
