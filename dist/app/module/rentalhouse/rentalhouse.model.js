"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalListing = void 0;
const mongoose_1 = require("mongoose");
const rentalhouse_constant_1 = require("./rentalhouse.constant");
const rentalListingSchema = new mongoose_1.Schema({
    landlordId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (Landlord)
        required: true,
    },
    holding: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        enum: rentalhouse_constant_1.Districts,
        required: true,
    },
    unitNumber: {
        type: String, // e.g., '1A', '2B', '3C'
        required: true,
    },
    postalCode: {
        type: Number,
    },
    upazila: {
        type: String,
    },
    citycorporation: {
        type: String,
    },
    division: {
        type: String,
        enum: rentalhouse_constant_1.Divisions,
        required: true,
    },
    country: {
        type: String,
        default: 'Bangladesh',
    },
    description: {
        type: String,
        required: true,
    },
    rentAmount: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    imageUrls: {
        type: [String],
        default: [],
    },
    availableFrom: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        enum: ['family', 'bachelor'],
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    reviews: {
        type: [mongoose_1.Schema.Types.ObjectId], // Array of ObjectIds referencing the Review model
        ref: 'Review',
        default: [],
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    specification: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    keyFeatures: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
});
// ✅ Ensure unique `holding` number across **all landlords**
// rentalListingSchema.index({ holding: 1 }, { unique: true });
// ✅ Ensure unique `holding + unitNumber` across the same landlord
// ✅ Ensure `holding` is unique per address across all landlords
rentalListingSchema.index({
    holding: 1,
    unitNumber: 1,
    division: 1,
    district: 1,
    upazila: 1,
    citycorporation: 1,
}, { unique: true });
const RentalListing = (0, mongoose_1.model)('RentalListing', rentalListingSchema);
exports.RentalListing = RentalListing;
