import { User } from '../user/user.model';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status-codes';
import { IRentalListing } from './rentalhouse.interface';
import { RentalListing } from './rentalhouse.model';

import QueryBuilder from '../../builder/QueryBuilder';
import { rentalHouseSearchableFields } from './rentalhouse.constant';

const createRentalHouseIntoDB = async (
  user: { email?: string; phoneNumber?: string },
  payload: IRentalListing,
) => {
  // Find the landlord by email or phoneNumber
  const landlord =
    (await User.findOne({ email: user.email })) ??
    (await User.findOne({ phoneNumber: user.phoneNumber }));

  if (!landlord) {
    throw new AppError(httpStatus.NOT_FOUND, 'Landlord not found');
  }

  // 🔍 Check if the same landlord already has this unit under the same holding
  const existingUnit = await RentalListing.findOne({
    holding: payload.holding,
    unitNumber: payload.unitNumber, // Ensure unitNumber is unique per holding
    landlordId: landlord._id,
  });

  if (existingUnit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Unit ${payload.unitNumber} under holding ${payload.holding} already exists.`,
    );
  }

  // 🔍 Check if the holding is already used at the same location by another landlord
  const existingHolding = await RentalListing.findOne({
    holding: payload.holding,
    division: payload.division,
    district: payload.district,
    upazila: payload.upazila,
    citycorporation: payload.citycorporation,
  });

  if (
    existingHolding &&
    existingHolding.landlordId.toString() !== landlord._id.toString()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Holding number ${payload.holding} is already used at this location by another landlord.`,
    );
  }

  // Create the rental listing
  const newRental = await RentalListing.create({
    ...payload,
    landlordId: landlord._id,
  });

  // Ensure the landlord's `isListings` is set to true
  await User.findByIdAndUpdate(landlord._id, { isListings: false });

  return newRental;
};

const getAllRentalIntoDB = async (query: Record<string, unknown>) => {
  const rentalQuery = new QueryBuilder(
    RentalListing.find().populate('landlordId'),
    query,
  )
    .search(rentalHouseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await rentalQuery.modelQuery;
  const meta = await rentalQuery.countTotal();

  if (result.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No rental listings found for your account',
    );
  }

  return {
    meta,
    result,
  };
};

const getMyRentalIntoDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const rentalQuery = new QueryBuilder(
    RentalListing.find({ landlordId: userId }).populate('landlordId'),
    query,
  )
    .search(rentalHouseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields(); // ✅ Apply pagination before executing query
  const result = await rentalQuery.modelQuery;
  const meta = await rentalQuery.countTotal();
  if (result.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No rental listings found for this landlord',
    );
  }
  return {
    meta,
    result,
  };
};

const updateRentalByLandlordIntoDB = async (
  landlordId: string, // Authenticated landlord's ID
  rentalId: string,
  data: Partial<IRentalListing>,
) => {
  // Find rental by ID first (ignoring landlord)
  const rental = await RentalListing.findById(rentalId);
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental House not found');
  } else if (rental.landlordId.toString() !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to update this rental',
    ); // Check if the landlord owns this rental
  }

  // Update the rental listing
  const updatedRental = await RentalListing.findByIdAndUpdate(rentalId, data, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules apply
  });
  return updatedRental;
};

const updateRentalByAdminIntoDB = async (
  adminId: string,
  rentalId: string,
  data: Partial<IRentalListing>,
) => {
  const admin = await User.findById(adminId);
  if (!admin || admin.role !== 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only admins can update rental listing',
    );
  }

  const rental = await RentalListing.findById(rentalId);
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental house not found');
  }

  const updateRental = await RentalListing.findByIdAndUpdate(rentalId, data, {
    new: true,
    runValidators: true,
  });

  return updateRental;
};

const deleteRentalFromDB = async (landlordId: string, rentalId: string) => {
  const rental = await RentalListing.findById(rentalId);
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental House not found');
  }
  if (rental.landlordId.toString() !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to delete this rental',
    );
  }

  await RentalListing.findByIdAndDelete(rentalId);

  // Check if the landlord has any other rental listings
  const remainingListings = await RentalListing.findOne({ landlordId });
  if (!remainingListings) {
    // If no rentals left, set isListings to false
    await User.findByIdAndUpdate(landlordId, { isListings: true });
  }

  return { message: 'Rental deleted successfully' };
};

const deleteByAdminRentalFromDB = async (adminId: string, rentalId: string) => {
  // Fetch the admin user properly
  const admin = await User.findById(adminId).lean(); // Use .lean() to get a plain JavaScript object

  if (!admin || admin.role !== 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only admins can delete rental listings',
    );
  }

  // Find rental by ID first
  const rental = await RentalListing.findById(rentalId);
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental house not found');
  }

  // Delete the rental listing
  await RentalListing.findByIdAndDelete(rentalId);

  // Check if the landlord has any other rental listings
  const remainingListings = await RentalListing.findOne({
    landlordId: rental.landlordId,
  });
  if (!remainingListings) {
    // If no rentals left, set isListings to false
    await User.findByIdAndUpdate(rental.landlordId, { isListings: true });
  }

  return { message: 'Rental deleted successfully' };
};

const getSingleRentalIntoDB = async (rentalId: string) => {
  const result = await RentalListing.findById(rentalId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental House not found');
  }
  return result;
};

export const RentalListingService = {
  createRentalHouseIntoDB,
  getAllRentalIntoDB,
  getMyRentalIntoDB,
  updateRentalByLandlordIntoDB,
  updateRentalByAdminIntoDB,
  deleteRentalFromDB,
  deleteByAdminRentalFromDB,
  getSingleRentalIntoDB,
};
