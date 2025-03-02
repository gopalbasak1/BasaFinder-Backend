import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { reviewServices } from './review.service';
import AppError from '../../errors/AppErrors';

/**
 * Create Review
 */
const createReview = catchAsync(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new AppError(401, 'Unauthorized');

  const payload = req.body;
  const result = await reviewServices.createReview(email, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

/**
 * Get All Reviews
 */
const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviews();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

/**
 * Delete a Review (Admin Only)
 */
const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await reviewServices.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: {},
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  deleteReview,
};
