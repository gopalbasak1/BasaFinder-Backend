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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const rentalhouse_model_1 = require("../rentalhouse/rentalhouse.model");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return { result, meta };
});
const updateUserIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
    }
    // 🔥 Extract the actual user data if nested inside "user"
    const updateData = data.user ? Object.assign({}, data.user) : Object.assign({}, data);
    // Check if email or phone number is changing
    const isEmailChanged = updateData.email && updateData.email !== existingUser.email;
    const isPhoneChanged = updateData.phoneNumber &&
        updateData.phoneNumber !== existingUser.phoneNumber;
    // 🔹 Ensure nested updates work correctly
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, updateData, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation rules apply
    });
    return { updatedUser, shouldLogout: isEmailChanged || isPhoneChanged };
});
const changeActivityIntoDB = (id, payload, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the user being updated
    const userToUpdate = yield user_model_1.User.findById(id);
    if (!userToUpdate) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    // Fetch the current user (the one making the request)
    const currentUser = yield user_model_1.User.findById(currentUserId);
    if (!currentUser) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized action');
    }
    // Prevent an admin from deactivating another admin
    if (userToUpdate.role === 'admin' && currentUser.role === 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, "Admins can't deactivate his and other admins");
    }
    // Update the user's activity status
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteUserIntoDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // If the user is a landlord, delete their rental listings
    if (user.role === 'landlord') {
        yield rentalhouse_model_1.RentalListing.deleteMany({ landlordId: userId });
    }
    // ✅ Now deletes landlords, tenants, and admins (except themselves)
    yield user_model_1.User.findByIdAndDelete(userId);
    return { message: `${user.role} deleted successfully` };
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = (userid, role) => __awaiter(void 0, void 0, void 0, function* () {
    // Correct parameter name
    const result = yield user_model_1.User.findById(userid); // Use correct variable
    return result;
});
/**
 * Update a user's role.
 * - Allows conversion of tenants to landlords (or vice versa) or promoting a user to admin.
 * - Prevents demoting an admin to a non-admin role.
 */
const updateUserRoleIntoDB = (userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    // If the current user is an admin and the new role is not admin, do not allow change.
    if (user.role === 'admin' && newRole !== 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot change another admin’s role');
    }
    // Otherwise, update the role
    user.role = newRole;
    const updatedUser = yield user.save();
    return updatedUser;
});
const getSingleUserIntoDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found !');
    }
    if (user.isActive === false) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'User is in-active');
    }
    return user;
});
exports.UserServices = {
    // createUserIntoDB,
    getAllUsersFromDB,
    updateUserIntoDB,
    changeActivityIntoDB,
    getMe,
    deleteUserIntoDB,
    updateUserRoleIntoDB,
    getSingleUserIntoDB,
};
