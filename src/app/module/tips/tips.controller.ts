import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppErrors';
import { tipsServices } from './tips.service';

/**
 * Create tips
 */
const createTips = catchAsync(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new AppError(401, 'Unauthorized');

  const payload = req.body;
  const result = await tipsServices.createTips(email, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tips created successfully',
    data: result,
  });
});

/**
 * Get All tipss
 */
const getAllTips = catchAsync(async (req, res) => {
  const result = await tipsServices.getAllTips(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tips retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Delete a tips (Admin Only)
 */
const deleteTips = catchAsync(async (req, res) => {
  const { tipsId } = req.params;
  const result = await tipsServices.deleteTips(tipsId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: {},
  });
});

export const tipsController = {
  createTips,
  getAllTips,
  deleteTips,
};
