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
exports.testimonialController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const testimonial_service_1 = require("./testimonial.service");
/**
 * Create testimonial
 */
const createTestimonial = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email)
        throw new AppErrors_1.default(401, 'Unauthorized');
    const payload = req.body;
    const result = yield testimonial_service_1.testimonialServices.createTestimonial(email, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'testimonial created successfully',
        data: result,
    });
}));
/**
 * Get All testimonials
 */
const getAllTestimonials = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield testimonial_service_1.testimonialServices.getAllTestimonials(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'testimonials retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
/**
 * Delete a testimonial (Admin Only)
 */
const deleteTestimonial = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { testimonialId } = req.params;
    const result = yield testimonial_service_1.testimonialServices.deleteTestimonial(testimonialId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: result.message,
        data: {},
    });
}));
exports.testimonialController = {
    createTestimonial,
    getAllTestimonials,
    deleteTestimonial,
};
// const getRentalRequestsByTenant = catchAsync(
//     async (req: Request, res: Response) => {
//       const tenantId = req.user?.id;
//       const result = await RentalRequestService.getRentalRequestsByTenant(
//         tenantId as string,
//         req.query,
//       );
//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Rental requests retrieved successfully',
//         meta: result.meta,
//         data: result.result,
//       });
//     },
//   );
