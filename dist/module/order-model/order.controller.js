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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const orderABike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, product: productId, quantity } = req.body;
        // Validate the payload
        if (!email || !productId || !quantity || quantity <= 0) {
            res.status(400).json({
                message: 'Invalid request data',
                status: false,
            });
        }
        const payload = { email, product: productId, quantity };
        const result = yield order_service_1.orderService.orderABike(payload);
        res.status(200).json({
            message: 'Order created successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || 'Order creation failed',
            status: false,
        });
    }
});
const allOrderBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.params;
        const result = yield order_service_1.orderService.allOrderBike(payload);
        res.status(200).json({
            message: 'All orders bikes retrieved successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Validation failed',
            status: false,
            error: error.message,
        });
    }
});
const calculateRevenue = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield order_service_1.orderService.calculateRevenue();
        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: { totalRevenue },
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to calculate revenue',
            status: false,
            error: error.message,
        });
    }
});
exports.orderController = {
    orderABike,
    calculateRevenue,
    allOrderBike,
};
