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
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const orderABike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { product, orderQuantity } = req.body;
    //console.log(req.body);
    const result = yield order_service_1.orderService.orderABike(product, orderQuantity, email, req.ip);
    //console.log(result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderService.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Order verified successfully',
        data: order,
    });
}));
const allOrderBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.params;
    const result = yield order_service_1.orderService.allOrderBike(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'All orders reprieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.orderService.updateOrderIntoDB(orderId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Order updated successfully',
        data: result,
    });
}));
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.orderService.deleteOrderFromDB(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Order is deleted successfully',
        data: result,
    });
}));
const calculateRevenue = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalRevenue = yield order_service_1.orderService.calculateRevenue();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Revenue calculated successfully',
        data: totalRevenue,
    });
});
const getMyOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    //console.log(req.user);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ✅ Extract logged-in user ID
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role; // ✅ Extract user role
    if (!userId) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User no found');
    }
    const result = yield order_service_1.orderService.getMyOrder(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { orderStatus, estimatedDeliveryDate } = req.body;
    const result = yield order_service_1.orderService.updateOrderIntoDB(orderId, {
        orderStatus,
        estimatedDeliveryDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
}));
exports.orderController = {
    orderABike,
    calculateRevenue,
    allOrderBike,
    deleteOrder,
    updateOrder,
    getMyOrder,
    updateOrderStatus,
    verifyPayment,
};
