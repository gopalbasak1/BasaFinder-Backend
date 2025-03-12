import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppErrors';
import { testimonialServices } from './testimonial.service';

/**
 * Create testimonial
 */
const createTestimonial = catchAsync(async (req, res) => {
  const email = req.user?.email;
  if (!email) throw new AppError(401, 'Unauthorized');

  const payload = req.body;
  const result = await testimonialServices.createTestimonial(email, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'testimonial created successfully',
    data: result,
  });
});

/**
 * Get All testimonials
 */
const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialServices.getAllTestimonials(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'testimonials retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Delete a testimonial (Admin Only)
 */
const deleteTestimonial = catchAsync(async (req, res) => {
  const { testimonialId } = req.params;
  const result = await testimonialServices.deleteTestimonial(testimonialId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: {},
  });
});

export const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
};
// const getRentalRequestsByTenant = catchAsync(
//     async (req: Request, res: Response) => {
//       const tenantId = req.user?.id;

//       const result = await RentalRequestService.getRentalRequestsByTenant(
//         tenantId as string,
//         req.query,
//       );
//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Rental requests retrieved successfully',
//         meta: result.meta,
//         data: result.result,
//       });
//     },
//   );
