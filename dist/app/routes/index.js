"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const review_router_1 = __importDefault(require("../module/Review/review.router"));
const rentalhouse_route_1 = require("../module/rentalhouse/rentalhouse.route");
const request_route_1 = require("../module/request/request.route");
const testimonial_route_1 = require("../module/testimonial/testimonial.route");
const tips_route_1 = require("../module/tips/tips.route");
const router = (0, express_1.Router)();
// app.use('/api/products', bikeRouter); //1. Create a Bike
// app.use('/api/orders', orderRoute); //2.Order A Bike
const moduleRoutes = [
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
    {
        path: '/rental',
        route: rentalhouse_route_1.RentalRoute,
    },
    {
        path: '/rental-request',
        route: request_route_1.RequestRental,
    },
    {
        path: '/testimonial',
        route: testimonial_route_1.TestimonialRouter,
    },
    {
        path: '/tips',
        route: tips_route_1.TipsRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
