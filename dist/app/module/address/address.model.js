"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
// address.model.ts
const mongoose_1 = __importStar(require("mongoose"));
// Local address schema
const localAddressSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    details: { type: String },
}, { _id: false });
// Subdistrict schema
const subdistrictSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    localAddresses: [localAddressSchema], // Array of local addresses
}, { _id: false });
// District schema
const districtSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    subdistricts: [subdistrictSchema], // Array of subdistricts
}, { _id: false });
// Division schema
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    districts: [districtSchema], // Array of districts
}, { _id: false });
// Address schema (Main schema)
const addressSchema = new mongoose_1.Schema({
    country: { type: String, default: 'Bangladesh' },
    divisions: [divisionSchema], // Array of divisions
}, {
    timestamps: true,
});
// Model for Address
const Address = mongoose_1.default.model('Address', addressSchema);
exports.Address = Address;
