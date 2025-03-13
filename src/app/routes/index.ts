import { Router } from 'express';
import { UserRoute } from '../module/user/user.route';
import { AuthRoutes } from '../module/auth/auth.route';
import reviewRouter from '../module/Review/review.router';
import { RentalRoute } from '../module/rentalhouse/rentalhouse.route';

import { RequestRental } from '../module/request/request.route';
import { TestimonialRouter } from '../module/testimonial/testimonial.route';
import { TipsRouter } from '../module/tips/tips.route';

const router = Router();

// app.use('/api/products', bikeRouter); //1. Create a Bike
// app.use('/api/orders', orderRoute); //2.Order A Bike

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/reviews',
    route: reviewRouter,
  },
  {
    path: '/rental',
    route: RentalRoute,
  },
  {
    path: '/rental-request',
    route: RequestRental,
  },
  {
    path: '/testimonial',
    route: TestimonialRouter,
  },
  {
    path: '/tips',
    route: TipsRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
