"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const orderRoute = (0, express_1.default)();
orderRoute.post('/', order_controller_1.orderController.orderABike);
orderRoute.get('/', order_controller_1.orderController.allOrderBike);
orderRoute.get('/revenue', order_controller_1.orderController.calculateRevenue);
exports.default = orderRoute;
