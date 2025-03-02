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
exports.auth = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppErrors_1 = __importDefault(require("../errors/AppErrors"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../module/user/user.model");
const config_1 = __importDefault(require("../config"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // Verify the token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized');
        }
        // const { role, email, iat } = decoded;
        // Find the user by email
        const user = yield user_model_1.User.findOne({ email: decoded.email });
        if (!user) {
            throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
        }
        //console.log('User Role:', user.role);
        if (user.passwordChangedAt &&
            user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, decoded.iat)) {
            throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Token issued before password change');
        }
        // Ensure the user has the required role
        if (requiredRoles.length &&
            !requiredRoles.includes(user.role)) {
            throw new AppErrors_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // Attach the full user details to `req.user`
        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            image: user.image,
            name: user.name,
        };
        //console.log('Authenticated User:', req.user);
        next();
    }));
};
exports.auth = auth;
