"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("../user/user.constant");
const review_controller_1 = require("./review.controller");
const reviewRouter = (0, express_1.Router)();
reviewRouter.post('/create-review', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.tenant), review_controller_1.reviewController.createReview);
reviewRouter.get('/', review_controller_1.reviewController.getAllReviews);
exports.default = reviewRouter;
