"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
//req and res manage
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
exports.productController = void 0;
const product_service_1 = require("./product.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
//1. Create a Bike
const createABike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const payload = req.body;
    const result = yield product_service_1.productService.createABike(email, payload);
    //res status
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Products create successfully',
        data: result,
    });
}));
//2. Get All Bikes
const getAllBikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getAllBikes(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'All Bike are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});
//3. Get a Specific Bike
const getSpecificBikes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params); // jodi bujata na pari kon id diya query korta hoba tobaa ae vaba console korta hoba
    //user this product id select than send backend request(id: diya kaj korla params hoba)
    const { productId } = req.params;
    const result = yield product_service_1.productService.getSpecificBikes(productId); //ae productId diya single specific bikes find kora hoba
    if (!result) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Product not found!');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Bike is retrieved successfully',
        data: result,
    });
}));
//4. Update a Bike
const updateBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const body = req.body;
    const result = yield product_service_1.productService.updateBike(productId, body);
    res.status(200).json({
        message: 'Bike updated successfully',
        status: true,
        result,
    });
}));
const deleteBike = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const result = yield product_service_1.productService.deleteBike(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Bike is deleted',
        data: result,
    });
}));
exports.productController = {
    createABike,
    getAllBikes,
    getSpecificBikes,
    updateBike,
    deleteBike,
};
