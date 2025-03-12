"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRequest = void 0;
// rentalRequest.model.ts
const mongoose_1 = require("mongoose");
const rentalRequestSchema = new mongoose_1.Schema({
    listingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RentalListing', // Reference to Rental Listing
        required: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference to User (Tenant)
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true,
    },
    landlordPhone: {
        type: String,
    },
    moveInDate: { type: Date },
    rentalDuration: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    message: {
        type: String,
        required: true,
    },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
exports.RentalRequest = (0, mongoose_1.model)('RentalRequest', rentalRequestSchema);
