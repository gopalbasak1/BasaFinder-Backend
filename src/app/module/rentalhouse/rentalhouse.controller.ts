import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { RentalListingService } from './rentalhouse.service';
import AppError from '../../errors/AppErrors';

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
  console.log(result);
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

const getMyRental = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  const result = await RentalListingService.getMyRentalIntoDB(
    userId,
    req?.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental retrieved successfully',
    meta: result?.meta,
    data: result?.result,
  });
});

const updateRentalByLandlord = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;
  const rentalId = req.params.rentalId;
  const body = req.body;
  const result = await RentalListingService.updateRentalByLandlordIntoDB(
    landlordId as string,
    rentalId,
    body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house update successfully',
    data: result,
  });
});

const updateRentalByAdmin = catchAsync(async (req, res) => {
  const adminId = req.user?.id;
  const rentalId = req.params?.rentalId;
  const body = req.body;
  const result = await RentalListingService.updateRentalByAdminIntoDB(
    adminId as string,
    rentalId,
    body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house update successfully',
    data: result,
  });
});

const deleteRentalByLandlord = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;

  const rentalId = req.params.rentalId;

  const result = await RentalListingService.deleteRentalFromDB(
    landlordId as string,
    rentalId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house delete successfully',
    data: result,
  });
});

const deleteRentalByAdmin = catchAsync(async (req, res) => {
  const adminId = req.user?.id;
  const rentalId = req.params.rentalId;

  const result = await RentalListingService.deleteByAdminRentalFromDB(
    adminId as string,
    rentalId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house delete successfully',
    data: result,
  });
});

const getSingleRental = catchAsync(async (req, res) => {
  const { rentalId } = req.params;
  const result = await RentalListingService.getSingleRentalIntoDB(rentalId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental house retrieved successfully',
    data: result,
  });
});

export const RentalListingController = {
  createRentalHouse,
  getAllRental,
  getMyRental,
  updateRentalByLandlord,
  updateRentalByAdmin,
  deleteRentalByLandlord,
  deleteRentalByAdmin,
  getSingleRental,
};
