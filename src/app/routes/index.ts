import { Router } from 'express';
import bikeRouter from '../module/product-model(bike)/product.router';
import orderRoute from '../module/order-model/order.router';
import { UserRoute } from '../module/user/user.route';
import { AuthRoutes } from '../module/auth/auth.route';
import reviewRouter from '../module/Review/review.router';
import { AddressRoute } from '../module/address/address.route';
import { RentalRoute } from '../module/rentalhouse/rentalhouse.route';

import { RequestRental } from '../module/request/request.route';

const router = Router();

// app.use('/api/products', bikeRouter); //1. Create a Bike
// app.use('/api/orders', orderRoute); //2.Order A Bike

const moduleRoutes = [
  {
    path: '/products',
    route: bikeRouter,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
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
    path: '/address',
    route: AddressRoute,
  },
  {
    path: '/rental',
    route: RentalRoute,
  },
  {
    path: '/rental-request',
    route: RequestRental,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
