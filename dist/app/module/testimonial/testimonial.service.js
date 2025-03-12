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
exports.testimonialServices = void 0;
const testimonial_model_1 = __importDefault(require("./testimonial.model"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
const testimonial_model_2 = __importDefault(require("./testimonial.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/**
 * Create a testimonial
 */
const createTestimonial = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(404, 'User not found');
    }
    if (user.role === 'landlord') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Landlord not permitted');
    }
    const newTestimonial = yield testimonial_model_1.default.create(Object.assign(Object.assign({}, payload), { user: user._id }));
    return newTestimonial;
});
/**
 * Get all testimonials
 */
const getAllTestimonials = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const baseQuery = new QueryBuilder_1.default(testimonial_model_2.default.find().populate('user'), query);
    const result = yield baseQuery.modelQuery;
    const meta = yield baseQuery.countTotal();
    return { result, meta };
});
/**
 * Delete a testimonial (Admin Only)
 */
const deleteTestimonial = (testimonialId) => __awaiter(void 0, void 0, void 0, function* () {
    const testimonial = yield testimonial_model_2.default.findById(testimonialId);
    if (!testimonial)
        throw new AppErrors_1.default(404, 'testimonial not found');
    yield testimonial_model_2.default.findByIdAndDelete(testimonialId);
    return { message: 'testimonial deleted successfully' };
});
exports.testimonialServices = {
    createTestimonial,
    getAllTestimonials,
    deleteTestimonial,
};
