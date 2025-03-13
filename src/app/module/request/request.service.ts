/* eslint-disable @typescript-eslint/no-explicit-any */
// rentalRequest.service.ts

import { Types } from 'mongoose';

import httpStatus from 'http-status-codes';
import { IRentalRequest } from './request.interface';
import { RentalRequest } from './request.model';
import AppError from '../../errors/AppErrors';
import { User } from '../user/user.model';
import { IRentalListing } from '../rentalhouse/rentalhouse.interface';
import { requestUtils } from './request.utils';
import { RentalListing } from '../rentalhouse/rentalhouse.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { rentalHouseSearchableFields } from './request.constant';
import { sendEmail } from '../../utils/sendEmail';

// Create a new rental request
const createRentalRequest = async (
  tenantId: string,
  payload: Partial<IRentalRequest>,
) => {
  if (!payload.rentalDuration || payload.rentalDuration < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Rental duration must be at least 1 month',
    );
  }

  if (!payload.moveInDate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Move-in date is required');
  }

  // Find the listing to check availability
  const listing = await RentalListing.findById(payload.listingId);
  if (!listing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Listing not found');
  }

  // 🔹 Check if the listing is already booked BEFORE creating a rental request
  if (listing.isAvailable === false) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This Rental House is already booked.',
    );
  }

  // Validate that moveInDate is not before availableFrom
  if (new Date(payload.moveInDate) < new Date(listing.availableFrom)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Move-in date cannot be before the listing's available date (${listing.availableFrom}).`,
    );
  }

  // Find tenant and create the rental request
  const tenant = await User.findById(tenantId);
  if (!tenant) {
    throw new AppError(httpStatus.NOT_FOUND, 'Tenant not found');
  }

  // Check if the tenant has already requested this listing
  const existingRequest = await RentalRequest.findOne({
    tenantId,
    listingId: payload.listingId, // Ensure same listing
  });

  // If a request exists and it's not rejected, prevent duplicate request
  if (existingRequest && existingRequest.status !== 'rejected') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already submitted a rental request for this listing.',
    );
  }

  const newRequest = await RentalRequest.create({
    ...payload,
    tenantId,
  });

  // Populate listing to get landlord info
  const populatedRequest = await newRequest.populate([
    {
      path: 'listingId',
      model: 'RentalListing',
      populate: {
        path: 'landlordId',
        model: 'User', // Assuming landlords are stored in the User model
        select: 'email name',
      },
    },
    {
      path: 'tenantId',
    },
  ]);

  // Extract landlord details
  const populatedListing = populatedRequest.listingId as any; // Explicitly cast as any to access properties

  const landlord = populatedListing?.landlordId as any;

  if (landlord && landlord.email) {
    const subject = 'New Rental Request Received';
    const text = `Hello ${landlord.name},\n\nA new rental request has been submitted for your listing (${listing.holding}).\n\n📩 Tenant Message: "${newRequest?.message}".\n\nPlease review the request in your dashboard.\n\nThank you,\nBasa Finder Team
    

    `;
    await sendEmail(landlord.email, subject, text);
  }

  return newRequest;
};

// Retrieve all rental requests submitted by a tenant
const getRentalRequestsByTenant = async (
  tenantId: string,
  query: Record<string, unknown>,
) => {
  // Ensure that only requests belonging to the tenant are queried
  const baseQuery = RentalRequest.find({
    tenantId: new Types.ObjectId(tenantId),
  })
    .populate({
      path: 'listingId',
      populate: {
        path: 'landlordId',
        select: 'name email phoneNumber',
      },
    })
    .populate({
      path: 'tenantId',
      select: 'name email phoneNumber',
    });

  // Use QueryBuilder to add search, filter, sort, fields, and pagination based on req.query
  const requestsQuery = new QueryBuilder(baseQuery, query)
    .search(rentalHouseSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await requestsQuery.modelQuery;
  const meta = await requestsQuery.countTotal();

  // If no requests remain, throw an AppError.
  if (result.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No rental requests found for your account',
    );
  }

  return { meta, result };
};

// Retrieve all rental requests for listings owned by a landlord
const getRentalRequestsByLandlord = async (
  landlordId: string,
  query: Record<string, unknown>,
) => {
  // Build the base query with population for listing and tenant details.
  const baseQuery = RentalRequest.find()
    .populate({
      path: 'listingId',
      // Only populate listings where landlordId matches the given landlordId.
      match: { landlordId: new Types.ObjectId(landlordId) },
      populate: {
        path: 'landlordId',
        select: 'name email phoneNumber',
      },
    })
    .populate({
      path: 'tenantId',
      select: 'name email phoneNumber',
    });

  // Apply search, filter, sort, paginate, and fields using QueryBuilder
  const rentalQuery = new QueryBuilder(baseQuery, query)
    .search(rentalHouseSearchableFields) // e.g., ['holding', 'address', 'description']
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await rentalQuery.modelQuery;
  const meta = await rentalQuery.countTotal();

  // Filter out rental requests where listingId is null.
  const filteredRequests = result.filter((req) => req.listingId !== null);

  if (filteredRequests.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No rental requests found for your listings',
    );
  }

  return { meta, result: filteredRequests };
};
// Update a rental request (for landlord approval/rejection, setting landlordPhone, paymentStatus, etc.)
const updateRentalRequest = async (
  requestId: string,
  updateData: Partial<IRentalRequest>,
) => {
  const updatedRequest = await RentalRequest.findByIdAndUpdate(
    requestId,
    updateData,
    { new: true },
  ).populate([
    {
      path: 'tenantId',
      select: 'email name',
    },
    {
      path: 'listingId',
      select: 'holding landlordId',
      populate: {
        path: 'landlordId', // Populate landlord details
        select: 'name email phoneNumber',
      }, // Assuming 'title' is the correct field for the listing's name
    },
  ]);

  if (!updatedRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental request not found');
  }

  // Ensure tenant exists before sending an email
  const tenant = updatedRequest.tenantId as { email?: string; name?: string };
  const listing = updatedRequest.listingId as {
    holding?: string;
    landlordId?: any;
  };

  if (tenant?.email) {
    const subject = 'Your Rental Request Has Been Updated';
    const text = `Hello ${tenant.name},\n\nYour rental request for listing "${listing.holding}" has been updated to "${updatedRequest.status}".\n\nLandlord Contact: ${listing.landlordId?.name} - ${listing.landlordId?.phoneNumber}\n\nPlease check your dashboard for more details.\n\nThank you,\nBasa Finder Team`;

    await sendEmail(tenant.email, subject, text);
  }

  return updatedRequest;
};

interface PaymentResponse {
  sp_order_id: string;
  transactionStatus: string;
  bank_status?: string;
  sp_code?: string;
  sp_message?: string;
  method?: string;
  date_time?: string;
  checkout_url?: string;
}

const payRentalRequestIntoDB = async (
  email: string,
  payload: any,
  client_ip: string,
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== 'tenant') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only tenants can pay for rental requests',
    );
  }

  const rentalRequest = await RentalRequest.findById(
    payload.rentalRequestId,
  ).populate<{ listingId: IRentalListing }>('listingId');

  if (!rentalRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental request not found');
  }

  if (rentalRequest.tenantId.toString() !== user._id.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only pay for your own rental request',
    );
  }

  if (rentalRequest.status !== 'approved') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Payment can only be made for approved rental request',
    );
  }

  if (!rentalRequest.listingId.isAvailable) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This listing is no longer available for rent',
    );
  }

  const rentAmount =
    rentalRequest.listingId.rentAmount * rentalRequest.rentalDuration;

  const shurjopayPayload = {
    amount: Number(rentAmount),
    order_id: rentalRequest._id,
    currency: 'BDT',
    customer_name: user.name,
    customer_address: 'N/A',
    customer_email: user.email,
    customer_phone: user.phoneNumber,
    customer_city: 'N/A',
    client_ip,
  };

  // 🔹 Call Payment API
  const payment: PaymentResponse =
    await requestUtils.makePayment(shurjopayPayload);

  console.log('Received Payment Response:', payment); // Debugging

  if (payment?.transactionStatus) {
    await RentalRequest.findByIdAndUpdate(rentalRequest._id, {
      $set: {
        'transaction.id': payment.sp_order_id,
        'transaction.transactionStatus': payment.transactionStatus,
        'transaction.bank_status': payment?.bank_status || 'N/A',
        'transaction.sp_code': payment?.sp_code || 'N/A',
        'transaction.sp_message': payment?.sp_message || 'N/A',
        'transaction.method': payment?.method || 'N/A',
        'transaction.date_time': payment?.date_time || new Date().toISOString(),
        paymentStatus: 'paid',
      },
    });
  }

  console.log('Payment processed successfully for', user.email);

  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  // Verify the payment using your requestUtils
  const verifiedPayment = await requestUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const paymentData = verifiedPayment[0];

    // Check if the bank status indicates success
    if (paymentData.bank_status === 'Success') {
      // Update the rental request: set paymentStatus to 'paid'
      const updatedRequest = await RentalRequest.findOneAndUpdate(
        { 'transaction.id': order_id },
        {
          $set: {
            'transaction.bank_status': paymentData.bank_status,
            'transaction.sp_code': paymentData.sp_code,
            'transaction.sp_message': paymentData.sp_message,
            'transaction.transactionStatus': paymentData.transaction_status,
            'transaction.method': paymentData.method,
            'transaction.date_time': paymentData.date_time,
            paymentStatus: 'paid',
          },
        },
        { new: true },
      ); // Force execution
      console.log('Updated Rental Request:', updatedRequest);

      // If the rental request is updated, update the listing to mark it as unavailable
      if (updatedRequest && updatedRequest.listingId) {
        await RentalListing.findByIdAndUpdate(updatedRequest.listingId, {
          isAvailable: false,
        });
      }
    } else {
      // If payment is not successful, update the transaction fields and leave paymentStatus as 'pending'
      await RentalRequest.findOneAndUpdate(
        { 'transaction.id': order_id },
        {
          $set: {
            'transaction.bank_status': paymentData.bank_status,
            'transaction.sp_code': paymentData.sp_code,
            'transaction.sp_message': paymentData.sp_message,
            'transaction.transactionStatus': paymentData.transaction_status,
            'transaction.method': paymentData.method,
            'transaction.date_time': paymentData.date_time,
            paymentStatus: 'pending',
          },
        },
      );
    }
  }
  console.log('verifiedpayment services', verifiedPayment);
  return verifiedPayment;
};

const getAllRentalRequestIntoDBByAdmin = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your are not permitted');
  }

  const requestQuery = new QueryBuilder(
    RentalRequest.find()
      .populate({
        path: 'listingId',
        populate: 'landlordId',
      })
      .populate('tenantId'),
    query,
  )
    .search(rentalHouseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await requestQuery.modelQuery;
  const meta = await requestQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const RentalRequestService = {
  createRentalRequest,
  getRentalRequestsByTenant,
  getRentalRequestsByLandlord,
  updateRentalRequest,
  payRentalRequestIntoDB,
  verifyPayment,
  getAllRentalRequestIntoDBByAdmin,
};
