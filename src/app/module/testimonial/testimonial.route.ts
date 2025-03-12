import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { testimonialController } from './testimonial.controller';

const router = Router();

router.post(
  '/create-testimonial',
  auth(USER_ROLE.admin, USER_ROLE.tenant),
  testimonialController.createTestimonial,
);

router.get('/', testimonialController.getAllTestimonials);
router.delete('/testimonial/:id', testimonialController.deleteTestimonial);

export const TestimonialRouter = router;
