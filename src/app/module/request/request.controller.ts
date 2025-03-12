// rentalRequest.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { RentalRequestService } from './request.service';

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id;
  if (!tenantId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized: No tenant found',
      data: null,
    });
  }

  const { ...payload } = req.body;

  // if (!rentalDuration || rentalDuration <= 0) {
  //   return sendResponse(res, {
  //     statusCode: httpStatus.BAD_REQUEST,
  //     success: false,
  //     message: 'Rental duration must be greater than 0 months',
  //     data: null,
  //   });
  // }

  const result = await RentalRequestService.createRentalRequest(tenantId, {
    ...payload,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental request created successfully',
    data: result,
  });
});

const getRentalRequestsByTenant = catchAsync(
  async (req: Request, res: Response) => {
    const tenantId = req.user?.id;

    const result = await RentalRequestService.getRentalRequestsByTenant(
      tenantId as string,
      req.query,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental requests retrieved successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

const getRentalRequestsByLandlord = catchAsync(
  async (req: Request, res: Response) => {
    const landlordId = req.user?.id;

    const result = await RentalRequestService.getRentalRequestsByLandlord(
      landlordId as string,
      req.query,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rental requests for your listings retrieved successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

const updateRentalRequest = catchAsync(async (req, res) => {
  // This endpoint is for landlords to respond to a rental request
  const { requestId } = req.params;
  const updateData = req.body;
  const result = await RentalRequestService.updateRentalRequest(
    requestId,
    updateData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental request updated successfully',
    data: result,
  });
});

const payRentalRequest = catchAsync(async (req, res) => {
  //console.log('controller', req.body);
  const email = req.user?.email;
  const payload = req.body;
  const result = await RentalRequestService.payRentalRequestIntoDB(
    email as string,
    payload,
    req.ip!,
  );
  //console.log('result', result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental request payment successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await RentalRequestService.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rental Booked verified successfully',
    data: order,
  });
});

const getAllRentalRequestByAdmin = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await RentalRequestService.getAllRentalRequestIntoDBByAdmin(
    userId as string,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'All rental request retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const RentalRequestController = {
  createRentalRequest,
  getRentalRequestsByTenant,
  getRentalRequestsByLandlord,
  updateRentalRequest,
  payRentalRequest,
  verifyPayment,
  getAllRentalRequestByAdmin,
};
