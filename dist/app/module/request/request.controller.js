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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequestController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const request_service_1 = require("./request.service");
const createRentalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!tenantId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.UNAUTHORIZED,
            success: false,
            message: 'Unauthorized: No tenant found',
            data: null,
        });
    }
    const payload = __rest(req.body, []);
    // if (!rentalDuration || rentalDuration <= 0) {
    //   return sendResponse(res, {
    //     statusCode: httpStatus.BAD_REQUEST,
    //     success: false,
    //     message: 'Rental duration must be greater than 0 months',
    //     data: null,
    //   });
    // }
    const result = yield request_service_1.RentalRequestService.createRentalRequest(tenantId, Object.assign({}, payload));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Rental request created successfully',
        data: result,
    });
}));
const getRentalRequestsByTenant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tenantId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield request_service_1.RentalRequestService.getRentalRequestsByTenant(tenantId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental requests retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const getRentalRequestsByLandlord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield request_service_1.RentalRequestService.getRentalRequestsByLandlord(landlordId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental requests for your listings retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const updateRentalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This endpoint is for landlords to respond to a rental request
    const { requestId } = req.params;
    const updateData = req.body;
    const result = yield request_service_1.RentalRequestService.updateRentalRequest(requestId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental request updated successfully',
        data: result,
    });
}));
const payRentalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //console.log('controller', req.body);
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const payload = req.body;
    const result = yield request_service_1.RentalRequestService.payRentalRequestIntoDB(email, payload, req.ip);
    //console.log('result', result);
    // console.log('result payrental', result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental request payment successfully',
        data: result,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield request_service_1.RentalRequestService.verifyPayment(req.query.order_id);
    //console.log('verifypayment', order);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Rental Booked verified successfully',
        data: order,
    });
}));
const getAllRentalRequestByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield request_service_1.RentalRequestService.getAllRentalRequestIntoDBByAdmin(userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'All rental request retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
exports.RentalRequestController = {
    createRentalRequest,
    getRentalRequestsByTenant,
    getRentalRequestsByLandlord,
    updateRentalRequest,
    payRentalRequest,
    verifyPayment,
    getAllRentalRequestByAdmin,
};
