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
  return await RentalListing.create({ ...payload, landlordId: landlord._id });
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

  return {
    meta,
    result,
  };
};

export const RentalListingService = {
  createRentalHouseIntoDB,
  getAllRentalIntoDB,
};
