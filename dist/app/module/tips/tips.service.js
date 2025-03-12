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
exports.tipsServices = void 0;
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const tips_model_1 = __importDefault(require("./tips.model"));
/**
 * Create a tips
 */
const createTips = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(404, 'User not found');
    }
    const newTips = yield tips_model_1.default.create(Object.assign(Object.assign({}, payload), { user: user._id }));
    return newTips;
});
/**
 * Get all tipss
 */
const getAllTips = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = new QueryBuilder_1.default(tips_model_1.default.find().populate('user'), query);
    const result = yield baseQuery.modelQuery;
    const meta = yield baseQuery.countTotal();
    return { result, meta };
});
/**
 * Delete a tips (Admin Only)
 */
const deleteTips = (tipsId) => __awaiter(void 0, void 0, void 0, function* () {
    const tips = yield tips_model_1.default.findById(tipsId);
    if (!tips)
        throw new AppErrors_1.default(404, 'tips not found');
    yield tips_model_1.default.findByIdAndDelete(tipsId);
    return { message: 'tips deleted successfully' };
});
exports.tipsServices = {
    createTips,
    getAllTips,
    deleteTips,
};
