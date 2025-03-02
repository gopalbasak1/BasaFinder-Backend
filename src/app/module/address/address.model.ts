// address.model.ts
import mongoose, { Schema } from 'mongoose';
import { IAddress } from './address.interface'; // Import the address interface

// Local address schema
const localAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    details: { type: String },
  },
  { _id: false }, // Disable _id for local address objects
);

// Subdistrict schema
const subdistrictSchema = new Schema(
  {
    name: { type: String, required: true },
    localAddresses: [localAddressSchema], // Array of local addresses
  },
  { _id: false },
);

// District schema
const districtSchema = new Schema(
  {
    name: { type: String, required: true },
    subdistricts: [subdistrictSchema], // Array of subdistricts
  },
  { _id: false },
);

// Division schema
const divisionSchema = new Schema(
  {
    name: { type: String, required: true },
    districts: [districtSchema], // Array of districts
  },
  { _id: false },
);

// Address schema (Main schema)
const addressSchema = new Schema(
  {
    country: { type: String, default: 'Bangladesh' },
    divisions: [divisionSchema], // Array of divisions
  },
  {
    timestamps: true,
  },
);

// Model for Address
const Address = mongoose.model<IAddress>('Address', addressSchema);

export { Address };
