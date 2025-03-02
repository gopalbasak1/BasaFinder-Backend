import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { reviewController } from './review.controller';

const reviewRouter = Router();

reviewRouter.post(
  '/create-review',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  reviewController.createReview,
);
reviewRouter.get('/', reviewController.getAllReviews);
export default reviewRouter;
