"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("../user/user.constant");
const orderRoute = (0, express_1.default)();
orderRoute.post('/orderBike', (0, auth_1.auth)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.orderABike);
orderRoute.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), order_controller_1.orderController.allOrderBike);
//orderRoute.patch('/:orderId', orderController.updateOrder);
orderRoute.delete('/:orderId', order_controller_1.orderController.deleteOrder);
orderRoute.get('/revenue', order_controller_1.orderController.calculateRevenue);
orderRoute.get('/my-orders', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), // ✅ Authenticated users only
order_controller_1.orderController.getMyOrder);
orderRoute.patch('/:orderId/status', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), order_controller_1.orderController.updateOrderStatus);
orderRoute.get('/verify', (0, auth_1.auth)(user_constant_1.USER_ROLE.customer), order_controller_1.orderController.verifyPayment);
exports.default = orderRoute;
