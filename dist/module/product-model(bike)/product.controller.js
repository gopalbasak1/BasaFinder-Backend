"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
//req and res manage
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
//1. Create a Bike
const createABike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const result = yield product_service_1.productService.createABike(payload);
        //res status
        res.status(200).json({
            message: 'Bike created Successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            message: 'Validation failed',
            status: false,
            error: error || 'Something went wrong',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
});
//2. Get All Bikes
const getAllBikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a query object
        const { searchTerm } = req.query;
        // Search query setup
        let query = {};
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
            query = {
                $or: [
                    { name: regex }, // Search in `name`
                    { brand: regex }, // Search in `brand`
                    { category: regex }, // Search in `category`
                ],
            };
        }
        const result = yield product_service_1.productService.getAllBikes(query);
        res.status(200).json({
            message: 'Bikes retrieved successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Validation failed',
            status: false,
            error: error.message,
        });
    }
});
//3. Get a Specific Bike
const getSpecificBikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //console.log(req.params); // jodi bujata na pari kon id diya query korta hoba tobaa ae vaba console korta hoba
        //user this product id select than send backend request(id: diya kaj korla params hoba)
        const { productId } = req.params;
        const result = yield product_service_1.productService.getSpecificBikes(productId); //ae productId diya single specific bikes find kora hoba
        // If no product is found, return a 404 error
        if (!result) {
            res.status(404).json({
                message: 'This product not found',
                success: false,
                data: {},
            });
        }
        res.status(200).json({
            message: 'Bike retrieved successfully',
            status: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Resource not found',
            status: false,
            error: error,
        });
    }
});
//4. Update a Bike
const updateBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const body = req.body;
        const result = yield product_service_1.productService.updateBike(productId, body);
        res.status(200).json({
            message: 'Bike updated successfully',
            status: true,
            result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'ValidationError',
            status: false,
            error: error,
        });
    }
});
const deleteBike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const result = yield product_service_1.productService.deleteBike(productId);
        // Check if the bike was deleted
        if (!result) {
            res.status(404).json({
                message: 'Bike not found',
                success: false,
                data: {},
            });
        }
        res.status(200).json({
            message: 'Bike deleted successfully',
            status: true,
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'ValidationError',
            status: false,
            error: error,
        });
    }
});
exports.productController = {
    createABike,
    getAllBikes,
    getSpecificBikes,
    updateBike,
    deleteBike,
};
