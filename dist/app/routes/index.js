"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_router_1 = __importDefault(require("../module/product-model(bike)/product.router"));
const order_router_1 = __importDefault(require("../module/order-model/order.router"));
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const review_router_1 = __importDefault(require("../module/Review/review.router"));
const router = (0, express_1.Router)();
// app.use('/api/products', bikeRouter); //1. Create a Bike
// app.use('/api/orders', orderRoute); //2.Order A Bike
const moduleRoutes = [
    {
        path: '/products',
        route: product_router_1.default,
    },
    {
        path: '/orders',
        route: order_router_1.default,
    },
    {
        path: '/users',
        route: user_route_1.UserRoute,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/reviews',
        route: review_router_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
