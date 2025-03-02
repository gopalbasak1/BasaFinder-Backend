/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { orderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppErrors';

const orderABike = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const { product, orderQuantity } = req.body;
  //console.log(req.body);
  const result = await orderService.orderABike(
    product,
    orderQuantity,
    email as string,
    req.ip!,
  );
  //console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
  });
});

const allOrderBike = catchAsync(async (req: Request, res: Response) => {
  const payload = req.params;
  const result = await orderService.allOrderBike(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All orders reprieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.updateOrderIntoDB(orderId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.deleteOrderFromDB(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order is deleted successfully',
    data: result,
  });
});

const calculateRevenue = async (_req: Request, res: Response) => {
  const totalRevenue = await orderService.calculateRevenue();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue calculated successfully',
    data: totalRevenue,
  });
};

const getMyOrder = catchAsync(async (req, res) => {
  //console.log(req.user);
  const userId = req.user?.id; // ✅ Extract logged-in user ID
  const role = req.user?.role; // ✅ Extract user role

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User no found');
  }

  const result = await orderService.getMyOrder(userId, role as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, estimatedDeliveryDate } = req.body;

  const result = await orderService.updateOrderIntoDB(orderId, {
    orderStatus,
    estimatedDeliveryDate,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const orderController = {
  orderABike,
  calculateRevenue,
  allOrderBike,
  deleteOrder,
  updateOrder,
  getMyOrder,
  updateOrderStatus,
  verifyPayment,
};
