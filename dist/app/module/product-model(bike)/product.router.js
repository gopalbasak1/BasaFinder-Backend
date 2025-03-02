"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const productValidation_1 = require("./productValidation");
const bikeRouter = (0, express_1.Router)();
bikeRouter.post('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(productValidation_1.ProductValidation.createProduct), product_controller_1.productController.createABike);
bikeRouter.get('/', product_controller_1.productController.getAllBikes);
bikeRouter.get('/:productId', product_controller_1.productController.getSpecificBikes);
bikeRouter.put('/:productId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(productValidation_1.ProductValidation.updateProduct), product_controller_1.productController.updateBike);
bikeRouter.delete('/:productId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), product_controller_1.productController.deleteBike);
exports.default = bikeRouter;
