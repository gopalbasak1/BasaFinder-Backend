import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { RentalListingService } from './rentalhouse.service';

const createRentalHouse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  // Ensure user has an email or phoneNumber
  if (!user || (!user.email && !user.phoneNumber)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User email or phone number is missing.',
      data: null,
    });
  }

  const payload = req.body;
  const result = await RentalListingService.createRentalHouseIntoDB(
    { email: user.email, phoneNumber: user.phoneNumber },
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental house listing created successfully',
    data: result,
  });
});

const getAllRental = catchAsync(async (req, res) => {
  const result = await RentalListingService.getAllRentalIntoDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'All Rental house are retrieved successfully',
    meta: result?.meta,
    data: result?.result,
  });
});

export const RentalListingController = {
  createRentalHouse,
  getAllRental,
};
