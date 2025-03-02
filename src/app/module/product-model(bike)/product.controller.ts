/* eslint-disable @typescript-eslint/no-explicit-any */
//req and res manage

import { Request, Response } from 'express';
import { productService } from './product.service';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppErrors';

//1. Create a Bike
const createABike = catchAsync(async (req: Request, res: Response) => {
  const email = req.user?.email;
  const payload = req.body;
  const result = await productService.createABike(email as string, payload);

  //res status
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Products create successfully',
    data: result,
  });
});

//2. Get All Bikes
const getAllBikes = async (req: Request, res: Response) => {
  const result = await productService.getAllBikes(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Bike are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
};

//3. Get a Specific Bike
const getSpecificBikes = catchAsync(async (req: Request, res: Response) => {
  //console.log(req.params); // jodi bujata na pari kon id diya query korta hoba tobaa ae vaba console korta hoba

  //user this product id select than send backend request(id: diya kaj korla params hoba)
  const { productId } = req.params;
  const result = await productService.getSpecificBikes(productId); //ae productId diya single specific bikes find kora hoba

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is retrieved successfully',
    data: result,
  });
});

//4. Update a Bike
const updateBike = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const body = req.body;
  const result = await productService.updateBike(productId, body);
  res.status(200).json({
    message: 'Bike updated successfully',
    status: true,
    result,
  });
});

const deleteBike = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const result = await productService.deleteBike(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike is deleted',
    data: result,
  });
});

export const productController = {
  createABike,
  getAllBikes,
  getSpecificBikes,
  updateBike,
  deleteBike,
};
