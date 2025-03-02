// address.controller.ts
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { AddressServices } from './address.service';

// Get all addresses
const getAllAddresses = catchAsync(async (req, res) => {
  const addresses = await AddressServices.getAllAddresses();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Addresses retrieved successfully',
    data: addresses,
  });
});

// Create a new address
const createAddress = catchAsync(async (req, res) => {
  const addressData = req.body;
  const newAddress = await AddressServices.createAddress(addressData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Address created successfully',
    data: newAddress,
  });
});

export const AddressController = {
  getAllAddresses,
  createAddress,
};
