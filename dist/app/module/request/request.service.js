"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// rentalRequest.service.ts
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
exports.RentalRequestService = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const request_model_1 = require("./request.model");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
const request_utils_1 = require("./request.utils");
const rentalhouse_model_1 = require("../rentalhouse/rentalhouse.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const request_constant_1 = require("./request.constant");
const sendEmail_1 = require("../../utils/sendEmail");
// Create a new rental request
const createRentalRequest = (tenantId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.rentalDuration || payload.rentalDuration < 1) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'Rental duration must be at least 1 month');
    }
    if (!payload.moveInDate) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'Move-in date is required');
    }
    // Find tenant and create the rental request
    const tenant = yield user_model_1.User.findById(tenantId);
    if (!tenant) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Tenant not found');
    }
    // Check if the tenant has already requested this listing
    const existingRequest = yield request_model_1.RentalRequest.findOne({
        tenantId,
        listingId: payload.listingId, // Ensure same listing
    });
    // If a request exists and it's not rejected, prevent duplicate request
    if (existingRequest && existingRequest.status !== 'rejected') {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, 'You have already submitted a rental request for this listing.');
    }
    const newRequest = yield request_model_1.RentalRequest.create(Object.assign(Object.assign({}, payload), { tenantId }));
    // Populate listing to get landlord info
    const populatedRequest = yield newRequest.populate([
        {
            path: 'listingId',
            model: 'RentalListing',
            populate: {
                path: 'landlordId',
                model: 'User', // Assuming landlords are stored in the User model
                select: 'email name',
            },
        },
        {
            path: 'tenantId',
        },
    ]);
    // Extract landlord details
    const listing = populatedRequest.listingId; // Explicitly cast as any to access properties
    const landlord = listing === null || listing === void 0 ? void 0 : listing.landlordId;
    if (landlord && landlord.email) {
        const subject = 'New Rental Request Received';
        const text = `Hello ${landlord.name},\n\nA new rental request has been submitted for your listing (${listing.holding}).\n\n📩 Tenant Message: "${newRequest === null || newRequest === void 0 ? void 0 : newRequest.message}".\n\nPlease review the request in your dashboard.\n\nThank you,\nBasa Finder Team
    

    `;
        yield (0, sendEmail_1.sendEmail)(landlord.email, subject, text);
    }
    return newRequest;
});
// Retrieve all rental requests submitted by a tenant
const getRentalRequestsByTenant = (tenantId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure that only requests belonging to the tenant are queried
    const baseQuery = request_model_1.RentalRequest.find({
        tenantId: new mongoose_1.Types.ObjectId(tenantId),
    })
        .populate({
        path: 'listingId',
        populate: {
            path: 'landlordId',
            select: 'name email phoneNumber',
        },
    })
        .populate({
        path: 'tenantId',
        select: 'name email phoneNumber',
    });
    // Use QueryBuilder to add search, filter, sort, fields, and pagination based on req.query
    const requestsQuery = new QueryBuilder_1.default(baseQuery, query)
        .search(request_constant_1.rentalHouseSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const result = yield requestsQuery.modelQuery;
    const meta = yield requestsQuery.countTotal();
    // If no requests remain, throw an AppError.
    if (result.length === 0) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'No rental requests found for your account');
    }
    return { meta, result };
});
// Retrieve all rental requests for listings owned by a landlord
const getRentalRequestsByLandlord = (landlordId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Build the base query with population for listing and tenant details.
    const baseQuery = request_model_1.RentalRequest.find()
        .populate({
        path: 'listingId',
        // Only populate listings where landlordId matches the given landlordId.
        match: { landlordId: new mongoose_1.Types.ObjectId(landlordId) },
        populate: {
            path: 'landlordId',
            select: 'name email phoneNumber',
        },
    })
        .populate({
        path: 'tenantId',
        select: 'name email phoneNumber',
    });
    // Apply search, filter, sort, paginate, and fields using QueryBuilder
    const rentalQuery = new QueryBuilder_1.default(baseQuery, query)
        .search(request_constant_1.rentalHouseSearchableFields) // e.g., ['holding', 'address', 'description']
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield rentalQuery.modelQuery;
    const meta = yield rentalQuery.countTotal();
    // Filter out rental requests where listingId is null.
    const filteredRequests = result.filter((req) => req.listingId !== null);
    if (filteredRequests.length === 0) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'No rental requests found for your listings');
    }
    return { meta, result: filteredRequests };
});
// Update a rental request (for landlord approval/rejection, setting landlordPhone, paymentStatus, etc.)
const updateRentalRequest = (requestId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const updatedRequest = yield request_model_1.RentalRequest.findByIdAndUpdate(requestId, updateData, { new: true }).populate([
        {
            path: 'tenantId',
            select: 'email name',
        },
        {
            path: 'listingId',
            select: 'holding landlordId',
            populate: {
                path: 'landlordId', // Populate landlord details
                select: 'name email phoneNumber',
            }, // Assuming 'title' is the correct field for the listing's name
        },
    ]);
    if (!updatedRequest) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental request not found');
    }
    // Ensure tenant exists before sending an email
    const tenant = updatedRequest.tenantId;
    const listing = updatedRequest.listingId;
    if (tenant === null || tenant === void 0 ? void 0 : tenant.email) {
        const subject = 'Your Rental Request Has Been Updated';
        const text = `Hello ${tenant.name},\n\nYour rental request for listing "${listing.holding}" has been updated to "${updatedRequest.status}".\n\nLandlord Contact: ${(_a = listing.landlordId) === null || _a === void 0 ? void 0 : _a.name} - ${(_b = listing.landlordId) === null || _b === void 0 ? void 0 : _b.phoneNumber}\n\nPlease check your dashboard for more details.\n\nThank you,\nBasa Finder Team`;
        yield (0, sendEmail_1.sendEmail)(tenant.email, subject, text);
    }
    return updatedRequest;
});
const payRentalRequestIntoDB = (email, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(
    //   '🔍 Received rentalRequestId By services:',
    //   payload.rentalRequestId,
    // );
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== 'tenant') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Only tenants can pay for rental requests');
    }
    const rentalRequest = yield request_model_1.RentalRequest.findById(payload.rentalRequestId).populate('listingId');
    if (!rentalRequest) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental request not found');
    }
    // Ensure that only the tenant who made the request can pay
    if (rentalRequest.tenantId.toString() !== user._id.toString()) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'You can only pay for your own rental request');
    }
    // Check if the request is approved before allowing payment
    if (rentalRequest.status !== 'approved') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Payment can only be made for approved rental request');
    }
    // Check if the listing is still available before allowing payment
    if (!rentalRequest.listingId.isAvailable) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'This listing is no longer available for rent');
    }
    const rentAmount = rentalRequest.listingId.rentAmount * rentalRequest.rentalDuration;
    const shurjopayPayload = {
        amount: Number(rentAmount),
        order_id: rentalRequest._id,
        currency: 'BDT',
        customer_name: user.name,
        customer_address: 'N/A',
        customer_email: user.email,
        customer_phone: user.phoneNumber,
        customer_city: 'N/A',
        client_ip,
    };
    const payment = yield request_utils_1.requestUtils.makePayment(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        yield request_model_1.RentalRequest.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify the payment using your requestUtils
    const verifiedPayment = yield request_utils_1.requestUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        const paymentData = verifiedPayment[0];
        // Check if the bank status indicates success
        if (paymentData.bank_status === 'Success') {
            // Update the rental request: set paymentStatus to 'paid'
            const updatedRequest = yield request_model_1.RentalRequest.findOneAndUpdate({ 'transaction.id': order_id }, {
                $set: {
                    'transaction.bank_status': paymentData.bank_status,
                    'transaction.sp_code': paymentData.sp_code,
                    'transaction.sp_message': paymentData.sp_message,
                    'transaction.transactionStatus': paymentData.transaction_status,
                    'transaction.method': paymentData.method,
                    'transaction.date_time': paymentData.date_time,
                    paymentStatus: 'paid',
                },
            }, { new: true });
            // If the rental request is updated, update the listing to mark it as unavailable
            if (updatedRequest && updatedRequest.listingId) {
                yield rentalhouse_model_1.RentalListing.findByIdAndUpdate(updatedRequest.listingId, {
                    isAvailable: false,
                });
            }
        }
        else {
            // If payment is not successful, update the transaction fields and leave paymentStatus as 'pending'
            yield request_model_1.RentalRequest.findOneAndUpdate({ 'transaction.id': order_id }, {
                $set: {
                    'transaction.bank_status': paymentData.bank_status,
                    'transaction.sp_code': paymentData.sp_code,
                    'transaction.sp_message': paymentData.sp_message,
                    'transaction.transactionStatus': paymentData.transaction_status,
                    'transaction.method': paymentData.method,
                    'transaction.date_time': paymentData.date_time,
                    paymentStatus: 'pending',
                },
            });
        }
    }
    return verifiedPayment;
});
const getAllRentalRequestIntoDBByAdmin = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Your are not permitted');
    }
    const requestQuery = new QueryBuilder_1.default(request_model_1.RentalRequest.find()
        .populate({
        path: 'listingId',
        populate: 'landlordId',
    })
        .populate('tenantId'), query)
        .search(request_constant_1.rentalHouseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield requestQuery.modelQuery;
    const meta = yield requestQuery.countTotal();
    return {
        meta,
        result,
    };
});
exports.RentalRequestService = {
    createRentalRequest,
    getRentalRequestsByTenant,
    getRentalRequestsByLandlord,
    updateRentalRequest,
    payRentalRequestIntoDB,
    verifyPayment,
    getAllRentalRequestIntoDBByAdmin,
};
