"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please enter bike name'],
        minlength: [3, 'Name must be at least 3 characters, get {VALUE}'],
        maxlength: [50, "Name can't exceed 40 characters, get {VALUE}"],
    },
    brand: {
        type: String,
        required: [true, 'Please enter bike brand'],
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'],
    },
    category: {
        type: String,
        enum: {
            values: ['Mountain', 'Road', 'Hybrid', 'Electric'],
            message: '{VALUE} is invalid category, Category must be either Mountain, Road, Hybrid, or Electric',
        },
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [
            10,
            'Description must be at least 10 characters, get {VALUE}',
        ],
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity must be a positive number'],
    },
    inStock: {
        type: Boolean,
        required: [true, 'Please specify if the product is in stock'],
        default: true,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
// Pre-save hook to update `inStock` based on `quantity`
productSchema.pre('save', function (next) {
    this.inStock = this.quantity > 0;
    next();
});
//define and export the productSchema
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
