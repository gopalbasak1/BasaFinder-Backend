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
exports.RentalListingController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const rentalhouse_service_1 = require("./rentalhouse.service");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const createRentalHouse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // Ensure user has an email or phoneNumber
    if (!user || (!user.email && !user.phoneNumber)) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: 'User email or phone number is missing.',
            data: null,
        });
    }
    const payload = req.body;
    const result = yield rentalhouse_service_1.RentalListingService.createRentalHouseIntoDB({ email: user.email, phoneNumber: user.phoneNumber }, payload);
    //console.log(result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Rental house listing created successfully',
        data: result,
    });
}));
const getAllRental = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalhouse_service_1.RentalListingService.getAllRentalIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'All Rental house are retrieved successfully',
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.result,
    });
}));
const getMyRental = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User not found');
    }
    const result = yield rentalhouse_service_1.RentalListingService.getMyRentalIntoDB(userId, req === null || req === void 0 ? void 0 : req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental retrieved successfully',
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.result,
    });
}));
const updateRentalByLandlord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalId = req.params.rentalId;
    const body = req.body;
    const result = yield rentalhouse_service_1.RentalListingService.updateRentalByLandlordIntoDB(landlordId, rentalId, body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental house update successfully',
        data: result,
    });
}));
const updateRentalByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.rentalId;
    const body = req.body;
    const result = yield rentalhouse_service_1.RentalListingService.updateRentalByAdminIntoDB(adminId, rentalId, body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental house update successfully',
        data: result,
    });
}));
const deleteRentalByLandlord = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const landlordId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalId = req.params.rentalId;
    const result = yield rentalhouse_service_1.RentalListingService.deleteRentalFromDB(landlordId, rentalId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental house delete successfully',
        data: result,
    });
}));
const deleteRentalByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const rentalId = req.params.rentalId;
    const result = yield rentalhouse_service_1.RentalListingService.deleteByAdminRentalFromDB(adminId, rentalId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental house delete successfully',
        data: result,
    });
}));
const getSingleRental = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rentalId } = req.params;
    const result = yield rentalhouse_service_1.RentalListingService.getSingleRentalIntoDB(rentalId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Rental house retrieved successfully',
        data: result,
    });
}));
const getAllRentalListings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalhouse_service_1.RentalListingService.getAllRentalIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'All Rental house are retrieved successfully',
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.result,
    });
}));
exports.RentalListingController = {
    createRentalHouse,
    getAllRental,
    getMyRental,
    updateRentalByLandlord,
    updateRentalByAdmin,
    deleteRentalByLandlord,
    deleteRentalByAdmin,
    getSingleRental,
    getAllRentalListings,
};
