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
const product_model_1 = __importDefault(require("../product-model(bike)/product.model"));
const order_model_1 = __importDefault(require("./order.model"));
//1. Order a Bike;
const orderABike = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(payload.product);
    if (!product) {
        throw new Error('Product not found');
    }
    //If the product is out of stock or the requested quantity exceeds available stock:
    if (!product.inStock || product.quantity < payload.quantity) {
        throw new Error('Insufficient stock');
    }
    // Reduce inventory product.quantity - request.quantity
    product.quantity -= payload.quantity;
    //If the inventory reaches zero,
    if (product.quantity === 0) {
        product.inStock = false;
    }
    //Save the updated product data
    yield product.save();
    // Calculate total price
    const totalPrice = product.price * payload.quantity;
    // Create a new order in the database with the calculated totalPrice and other order details ae ta sas a korta hoba
    const order = yield order_model_1.default.create(Object.assign(Object.assign({}, payload), { totalPrice }));
    return order;
});
const allOrderBike = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.find(payload);
    return result;
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
exports.orderService = {
    orderABike,
    calculateRevenue,
    allOrderBike,
};
