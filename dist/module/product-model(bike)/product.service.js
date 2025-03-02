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
const product_model_1 = __importDefault(require("./product.model"));
//1. Create a Bike
const createABike = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //this item create only controller define
    const result = yield product_model_1.default.create(payload);
    return result;
});
//2. Get All Bikes
const getAllBikes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.find(query);
    //search a bike name, category, brand jodi original satha match na kora toba error dakha ba
    if (!result || result.length === 0) {
        throw new Error('No matching bikes found');
    }
    return result;
});
//3. Get a Specific Bike
const getSpecificBikes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findById(id);
    return result;
});
//4. Update a Bike
const updateBike = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    //specific bike update id and this bike all get data mean IBike
    const result = yield product_model_1.default.findByIdAndUpdate(id, data, {
        new: true,
    }); // new: true; use when user update data than new update data not show previous data
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
