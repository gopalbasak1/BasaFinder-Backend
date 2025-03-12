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
exports.UserController = void 0;
/* eslint-disable no-unused-vars */
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.cookies);
    const result = yield user_service_1.UserServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Extract userId from request URL
    const updatedUser = yield user_service_1.UserServices.updateUserIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
    });
}));
const changeActivity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserServices.changeActivityIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Status is updated successfully',
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.UNAUTHORIZED,
            success: false,
            message: 'Unauthorized: No user found',
            data: null,
        });
    }
    const { userId } = req.params;
    const loggedInUserId = req.user.id;
    // Ensure the admin cannot delete themselves
    if (req.user.role === 'admin' && loggedInUserId === userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: 'Admin cannot delete their own account',
            data: null,
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = yield user_service_1.UserServices.deleteUserIntoDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: null,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.UNAUTHORIZED,
            success: false,
            message: 'Unauthorized: No user found',
            data: null,
        });
    }
    const { id, role } = req.user;
    const result = yield user_service_1.UserServices.getMe(id, role); // Pass the correct parameters
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
}));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Expect the new role in the request body, e.g., { role: 'landlord' }
    const { role: newRole } = req.body;
    // Validate that newRole is provided
    if (!newRole) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: 'New role is required',
            data: null,
        });
    }
    // Call the service to update the user role
    const updatedUser = yield user_service_1.UserServices.updateUserRoleIntoDB(userId, newRole);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User role updated successfully',
        data: updatedUser,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserServices.getSingleUserIntoDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
}));
exports.UserController = {
    //createUser,
    getAllUsers,
    updateUser,
    changeActivity,
    deleteUser,
    getMe,
    updateUserRole,
    getSingleUser,
};
