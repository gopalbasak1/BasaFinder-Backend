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
exports.productService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const user_model_1 = require("../user/user.model");
const product_constant_1 = require("./product.constant");
const product_model_1 = __importDefault(require("./product.model"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
//1. Create a Bike
const createABike = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔹 Fetch user by email
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppErrors_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    // 🔹 Attach user ID to payload
    payload.user = user._id;
    payload.inStock = payload.totalQuantity > 0; // ✅ Assign the correct ObjectId
    // 🔹 Create new product with user reference
    const result = yield product_model_1.default.create(payload);
    return result;
});
//2. Get All Bikes
const getAllBikes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.default.find(), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return {
        meta,
        result,
    };
});
//3. Get a Specific Bike
const getSpecificBikes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findById(id);
    return result;
});
//4. Update a Bike
const updateBike = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure `inStock` updates based on quantity
    if (data.totalQuantity !== undefined) {
        data.inStock = data.totalQuantity > 0;
    }
    const result = yield product_model_1.default.findByIdAndUpdate(id, data, { new: true });
    return result;
});
//5. Delete a Bike
const deleteBike = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.productService = {
    createABike,
    getAllBikes,
    getSpecificBikes,
    updateBike,
    deleteBike,
};
