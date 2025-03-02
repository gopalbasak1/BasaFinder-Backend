"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const product_model_1 = __importDefault(require("../product-model(bike)/product.model"));
const user_model_1 = require("../user/user.model");
const order_model_1 = __importDefault(require("./order.model"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const order_utils_1 = require("./order.utils");
//1. Order a Bike;
const orderABike = (productId, orderQuantity, email, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔹 Fetch user by email and get ObjectId
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role === 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Admins cannot place orders');
    }
    //console.log('User Email:', user.email); // ✅ Confirm ObjectId is fetched
    // 🔹 Fetch product by ID
    const orderProduct = yield product_model_1.default.findById(productId);
    if (!orderProduct) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Product not found');
    }
    //console.log(orderProduct);
    // 🔹 Check for an existing order with the same product and user
    const existingOrder = yield order_model_1.default.findOne({
        user: user === null || user === void 0 ? void 0 : user._id,
        product: orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct._id,
    });
    if (existingOrder && existingOrder.orderStatus !== 'Delivered') {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'You already have an active order for this product. Wait until it is delivered before ordering again');
    }
    // 🔹 Check product stock
    if (!orderProduct.inStock || orderProduct.totalQuantity < orderQuantity) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient stock');
    }
    // 🔹 Reduce stock quantity
    orderProduct.totalQuantity -= orderQuantity;
    if (orderProduct.totalQuantity === 0) {
        orderProduct.inStock = false;
    }
    yield orderProduct.save();
    // 🔹 Calculate total price
    const totalPrice = orderProduct.price * orderQuantity;
    // Set estimated delivery date (7 days from now)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
    // 🔹 Create new order with correct user ID
    let order = yield order_model_1.default.create({
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
    const payment = yield order_utils_1.orderUtils.makePayment(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            orderStatus: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
const allOrderBike = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find().populate('product').populate('user'), query)
        .search(['product.name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
const updateOrderIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.findOneAndUpdate({
        _id: id,
    }, payload, {
        new: true,
    });
    if (!result) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Order not found');
    }
    return result;
});
const deleteOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Order not found');
    }
    return result;
    //console.log(result);
});
//2. Calculate Revenue from Orders (Aggregation)
const calculateRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //order collection thaka aggregation korta hoba
    const revenueData = yield order_model_1.default.aggregate([
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
    return ((_a = revenueData[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
    // revenueData[0] exists, and revenueData[0].totalRevenue = 3600
    // Returns: 3600
});
const getMyOrder = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === 'admin') {
        // ✅ Admin can see all orders
        return yield order_model_1.default.find().populate('product user');
    }
    else {
        // ✅ Customers can only see their own orders
        return yield order_model_1.default.find({ user: userId }).populate('product');
    }
});
exports.orderService = {
    orderABike,
    calculateRevenue,
    updateOrderIntoDB,
    allOrderBike,
    deleteOrderFromDB,
    getMyOrder,
    verifyPayment,
};
