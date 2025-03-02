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
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
// const createUserIntoDB = async (password: string, payload: TUser) => {
//   const existing = await User.findOne({ email: payload?.email });
//   if (existing) {
//     throw new AppError(httpStatus.CONFLICT, 'User already exists');
//   }
//   const userData: Partial<TUser> = { ...payload };
//   userData.password = password || (config.default_password as string);
//   const result = await User.create(userData);
//   console.log(result);
//   return result;
// };
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
    // 🔹 Ensure nested updates work correctly
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, updateData, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation rules apply
    });
    return updatedUser;
});
const changeStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = (userid, role) => __awaiter(void 0, void 0, void 0, function* () {
    // Correct parameter name
    const result = yield user_model_1.User.findById(userid); // Use correct variable
    return result;
});
exports.UserServices = {
    // createUserIntoDB,
    getAllUsersFromDB,
    updateUserIntoDB,
    changeStatus,
    getMe,
};
