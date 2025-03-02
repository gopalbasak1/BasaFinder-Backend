/* eslint-disable @typescript-eslint/no-explicit-any */
// address.service.ts
import { Address } from './address.model'; // Import the address model

// Get all addresses from the database
const getAllAddresses = async () => {
  return await Address.find(); // Return all addresses
};

// Create a new address and save it to the database
const createAddress = async (addressData: any) => {
  const newAddress = new Address(addressData);
  return await newAddress.save(); // Save the address to the database
};

export const AddressServices = {
  getAllAddresses,
  createAddress,
};
