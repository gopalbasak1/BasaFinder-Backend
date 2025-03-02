import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppErrors';
import Product from '../product-model(bike)/product.model';
import { User } from '../user/user.model';
import { iOrder } from './order.interface';
import Order from './order.model';
import httpStatus from 'http-status-codes';
import { orderUtils } from './order.utils';

//1. Order a Bike;
const orderABike = async (
  productId: string,
  orderQuantity: number,
  email: string,
  client_ip: string,
) => {
  // 🔹 Fetch user by email and get ObjectId
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Admins cannot place orders');
  }

  //console.log('User Email:', user.email); // ✅ Confirm ObjectId is fetched

  // 🔹 Fetch product by ID
  const orderProduct = await Product.findById(productId);
  if (!orderProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }
  //console.log(orderProduct);

  // 🔹 Check for an existing order with the same product and user
  const existingOrder = await Order.findOne({
    user: user?._id,
    product: orderProduct?._id,
  });

  if (existingOrder && existingOrder.orderStatus !== 'Delivered') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already have an active order for this product. Wait until it is delivered before ordering again',
    );
  }

  // 🔹 Check product stock
  if (!orderProduct.inStock || orderProduct.totalQuantity < orderQuantity) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient stock');
  }

  // 🔹 Reduce stock quantity
  orderProduct.totalQuantity -= orderQuantity;
  if (orderProduct.totalQuantity === 0) {
    orderProduct.inStock = false;
  }
  await orderProduct.save();

  // 🔹 Calculate total price
  const totalPrice = orderProduct.price * orderQuantity;

  // Set estimated delivery date (7 days from now)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  // 🔹 Create new order with correct user ID
  let order = await Order.create({
    user: user._id, // ✅ Pass ObjectId instead of email
    product: orderProduct._id,
    orderQuantity,
    totalPrice,
    orderStatus: 'Pending',
    estimatedDeliveryDate,
  });

  //console.log(order);

  //console.log('totalPrice', totalPrice);

  // payment integration
  // payload create
  const shurjopayPayload = {
    amount: Number(totalPrice),
    order_id: order._id,
    currency: 'BDT',
    customer_name: user.fullName,
    customer_address: 'N/A',
    customer_email: user.email,
    customer_phone: 'N/A',
    customer_city: 'N/A',
    client_ip,
  };
  //console.log(shurjopayPayload);
  const payment = await orderUtils.makePayment(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }
  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        orderStatus:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

const allOrderBike = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('product').populate('user'),
    query,
  )
    .search(['product.name'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const updateOrderIntoDB = async (id: string, payload: Partial<iOrder>) => {
  const result = await Order.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    {
      new: true,
    },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
};

const deleteOrderFromDB = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return result;
  //console.log(result);
};

//2. Calculate Revenue from Orders (Aggregation)
const calculateRevenue = async () => {
  //order collection thaka aggregation korta hoba
  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null, // Grouping all documents
        totalRevenue: { $sum: '$totalPrice' }, //doc sob totalPrice field jog kora dibo
      },
    },
  ]);
  //(revenueData[0])The first object in the array (index 0) contains the calculated totalRevenue.
  //If no orders exist, it defaults to [0] unless undefined
  //revenueData = [{ _id: null, totalRevenue: 3600 }];
  return revenueData[0]?.totalRevenue || 0;
  // revenueData[0] exists, and revenueData[0].totalRevenue = 3600
  // Returns: 3600
};

const getMyOrder = async (userId: string, role: string) => {
  if (role === 'admin') {
    // ✅ Admin can see all orders
    return await Order.find().populate('product user');
  } else {
    // ✅ Customers can only see their own orders
    return await Order.find({ user: userId }).populate('product');
  }
};

export const orderService = {
  orderABike,
  calculateRevenue,
  updateOrderIntoDB,
  allOrderBike,
  deleteOrderFromDB,
  getMyOrder,
  verifyPayment,
};
