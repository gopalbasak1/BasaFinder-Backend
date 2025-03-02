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
exports.AuthServices = void 0;
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const registerFromDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the existence of the JWT secret
    if (!config_1.default.jwt_access_secret) {
        throw new Error('JWT secret is not defined in the configuration.');
    }
    // Is User exists checking
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    //console.log(user);
    if (!user)
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'This user email is not found !');
    if ((user === null || user === void 0 ? void 0 : user.isDeleted) === false)
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'This user is deleted !');
    // Is User block checking
    const isUserStatus = user === null || user === void 0 ? void 0 : user.status;
    //console.log(isUserBlocked);
    if (isUserStatus === 'blocked')
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'This user is block !');
    //checking if the password is correct
    const isMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isMatch) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Incorrect password!');
    }
    //console.log(user.fullName);
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        image: user === null || user === void 0 ? void 0 : user.image,
        name: user === null || user === void 0 ? void 0 : user.name,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
const changePassword = (userData, // Accept undefined for unauthenticated users
payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData) {
        throw new AppErrors_1.default(401, 'User is not authenticated.');
    }
    // Find user by email (or use userData.id if available)
    const user = yield user_model_1.User.findOne({ email: userData.email }).select('+password');
    if (!user) {
        throw new AppErrors_1.default(404, 'User not found.');
    }
    // Ensure user is not deleted
    if (user.isDeleted === false) {
        throw new AppErrors_1.default(403, 'This user is deleted.');
    }
    // Ensure user is not blocked
    if (user.status === 'blocked') {
        throw new AppErrors_1.default(403, 'This user is blocked.');
    }
    // Check if the old password matches
    if (!user.password) {
        throw new AppErrors_1.default(500, 'Password not found for user.');
    }
    const isMatch = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isMatch) {
        throw new AppErrors_1.default(401, 'Old password is incorrect.');
    }
    // Hash the new password
    const saltRounds = Number(config_1.default.bcrypt_salt_rounds) || 12; // Default to 12 rounds if not set
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, saltRounds);
    // Update the user's password and set passwordChangedAt
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: userData.email }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, { new: true });
    if (!updatedUser) {
        throw new AppErrors_1.default(500, 'Password update failed.');
    }
    return {
        message: 'Password updated successfully.',
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted === false) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        image: user.image,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    registerFromDB,
    login,
    changePassword,
    refreshToken,
};
