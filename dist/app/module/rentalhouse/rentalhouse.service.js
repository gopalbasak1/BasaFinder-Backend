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
exports.RentalListingService = void 0;
const user_model_1 = require("../user/user.model");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const rentalhouse_model_1 = require("./rentalhouse.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const rentalhouse_constant_1 = require("./rentalhouse.constant");
const createRentalHouseIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Find the landlord by email or phoneNumber
    const landlord = (_a = (yield user_model_1.User.findOne({ email: user.email }))) !== null && _a !== void 0 ? _a : (yield user_model_1.User.findOne({ phoneNumber: user.phoneNumber }));
    if (!landlord) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Landlord not found');
    }
    // 🔍 Check if the same landlord already has this unit under the same holding
    const existingUnit = yield rentalhouse_model_1.RentalListing.findOne({
        holding: payload.holding,
        unitNumber: payload.unitNumber, // Ensure unitNumber is unique per holding
        landlordId: landlord._id,
    });
    if (existingUnit) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, `Unit ${payload.unitNumber} under holding ${payload.holding} already exists.`);
    }
    // 🔍 Check if the holding is already used at the same location by another landlord
    const existingHolding = yield rentalhouse_model_1.RentalListing.findOne({
        holding: payload.holding,
        division: payload.division,
        district: payload.district,
        upazila: payload.upazila,
        citycorporation: payload.citycorporation,
    });
    if (existingHolding &&
        existingHolding.landlordId.toString() !== landlord._id.toString()) {
        throw new AppErrors_1.default(http_status_codes_1.default.BAD_REQUEST, `Holding number ${payload.holding} is already used at this location by another landlord.`);
    }
    // Create the rental listing
    const newRental = yield rentalhouse_model_1.RentalListing.create(Object.assign(Object.assign({}, payload), { landlordId: landlord._id }));
    // Ensure the landlord's `isListings` is set to true
    yield user_model_1.User.findByIdAndUpdate(landlord._id, { isListings: false });
    return newRental;
});
const getAllRentalIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalQuery = new QueryBuilder_1.default(rentalhouse_model_1.RentalListing.find().populate('landlordId'), query)
        .search(rentalhouse_constant_1.rentalHouseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield rentalQuery.modelQuery;
    const meta = yield rentalQuery.countTotal();
    if (result.length === 0) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'No rental listings found for your account');
    }
    return {
        meta,
        result,
    };
});
const getMyRentalIntoDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentalQuery = new QueryBuilder_1.default(rentalhouse_model_1.RentalListing.find({ landlordId: userId }).populate('landlordId'), query)
        .search(rentalhouse_constant_1.rentalHouseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields(); // ✅ Apply pagination before executing query
    const result = yield rentalQuery.modelQuery;
    const meta = yield rentalQuery.countTotal();
    if (result.length === 0) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'No rental listings found for this landlord');
    }
    return {
        meta,
        result,
    };
});
const updateRentalByLandlordIntoDB = (landlordId, // Authenticated landlord's ID
rentalId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Find rental by ID first (ignoring landlord)
    const rental = yield rentalhouse_model_1.RentalListing.findById(rentalId);
    if (!rental) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental House not found');
    }
    else if (rental.landlordId.toString() !== landlordId) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized to update this rental'); // Check if the landlord owns this rental
    }
    // Update the rental listing
    const updatedRental = yield rentalhouse_model_1.RentalListing.findByIdAndUpdate(rentalId, data, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules apply
    });
    return updatedRental;
});
const updateRentalByAdminIntoDB = (adminId, rentalId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Only admins can update rental listing');
    }
    const rental = yield rentalhouse_model_1.RentalListing.findById(rentalId);
    if (!rental) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental house not found');
    }
    const updateRental = yield rentalhouse_model_1.RentalListing.findByIdAndUpdate(rentalId, data, {
        new: true,
        runValidators: true,
    });
    return updateRental;
});
const deleteRentalFromDB = (landlordId, rentalId) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield rentalhouse_model_1.RentalListing.findById(rentalId);
    if (!rental) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental House not found');
    }
    if (rental.landlordId.toString() !== landlordId) {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Unauthorized to delete this rental');
    }
    yield rentalhouse_model_1.RentalListing.findByIdAndDelete(rentalId);
    // Check if the landlord has any other rental listings
    const remainingListings = yield rentalhouse_model_1.RentalListing.findOne({ landlordId });
    if (!remainingListings) {
        // If no rentals left, set isListings to false
        yield user_model_1.User.findByIdAndUpdate(landlordId, { isListings: true });
    }
    return { message: 'Rental deleted successfully' };
});
const deleteByAdminRentalFromDB = (adminId, rentalId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the admin user properly
    const admin = yield user_model_1.User.findById(adminId).lean(); // Use .lean() to get a plain JavaScript object
    if (!admin || admin.role !== 'admin') {
        throw new AppErrors_1.default(http_status_codes_1.default.FORBIDDEN, 'Only admins can delete rental listings');
    }
    // Find rental by ID first
    const rental = yield rentalhouse_model_1.RentalListing.findById(rentalId);
    if (!rental) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental house not found');
    }
    // Delete the rental listing
    yield rentalhouse_model_1.RentalListing.findByIdAndDelete(rentalId);
    // Check if the landlord has any other rental listings
    const remainingListings = yield rentalhouse_model_1.RentalListing.findOne({
        landlordId: rental.landlordId,
    });
    if (!remainingListings) {
        // If no rentals left, set isListings to false
        yield user_model_1.User.findByIdAndUpdate(rental.landlordId, { isListings: true });
    }
    return { message: 'Rental deleted successfully' };
});
const getSingleRentalIntoDB = (rentalId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rentalhouse_model_1.RentalListing.findById(rentalId);
    if (!result) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'Rental House not found');
    }
    return result;
});
exports.RentalListingService = {
    createRentalHouseIntoDB,
    getAllRentalIntoDB,
    getMyRentalIntoDB,
    updateRentalByLandlordIntoDB,
    updateRentalByAdminIntoDB,
    deleteRentalFromDB,
    deleteByAdminRentalFromDB,
    getSingleRentalIntoDB,
};
