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
exports.reviewServices = void 0;
const review_model_1 = __importDefault(require("./review.model"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
/**
 * Create a review
 */
const createReview = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(404, 'User not found');
    }
    const newReview = yield review_model_1.default.create(Object.assign(Object.assign({}, payload), { user: user._id }));
    return newReview;
});
/**
 * Get all reviews
 */
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield review_model_1.default.find().populate('user', 'name email image');
});
/**
 * Delete a review (Admin Only)
 */
const deleteReview = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.default.findById(reviewId);
    if (!review)
        throw new AppErrors_1.default(404, 'Review not found');
    yield review_model_1.default.findByIdAndDelete(reviewId);
    return { message: 'Review deleted successfully' };
});
exports.reviewServices = {
    createReview,
    getAllReviews,
    deleteReview,
};
