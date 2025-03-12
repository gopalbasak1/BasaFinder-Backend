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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
// address.service.ts
const address_model_1 = require("./address.model"); // Import the address model
// Get all addresses from the database
const getAllAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield address_model_1.Address.find(); // Return all addresses
});
// Create a new address and save it to the database
const createAddress = (addressData) => __awaiter(void 0, void 0, void 0, function* () {
    const newAddress = new address_model_1.Address(addressData);
    return yield newAddress.save(); // Save the address to the database
});
exports.AddressServices = {
    getAllAddresses,
    createAddress,
};
