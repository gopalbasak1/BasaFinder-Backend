import Router from 'express';
import { orderController } from './order.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const orderRoute = Router();
orderRoute.post(
  '/orderBike',
  auth(USER_ROLE.customer),
  orderController.orderABike,
);
orderRoute.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  orderController.allOrderBike,
);
//orderRoute.patch('/:orderId', orderController.updateOrder);
orderRoute.delete('/:orderId', orderController.deleteOrder);
orderRoute.get('/revenue', orderController.calculateRevenue);
orderRoute.get(
  '/my-orders',
  auth(USER_ROLE.admin, USER_ROLE.customer), // ✅ Authenticated users only
  orderController.getMyOrder,
);

orderRoute.patch(
  '/:orderId/status',
  auth(USER_ROLE.admin),
  orderController.updateOrderStatus,
);

orderRoute.get(
  '/verify',
  auth(USER_ROLE.customer),
  orderController.verifyPayment,
);

export default orderRoute;
