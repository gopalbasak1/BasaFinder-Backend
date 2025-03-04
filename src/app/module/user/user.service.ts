/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppErrors';
import { RentalListing } from '../rentalhouse/rentalhouse.model';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status-codes';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { result, meta };
};

const updateUserIntoDB = async (id: string, data: Partial<TUser> | any) => {
  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new Error('User not found');
  }

  // 🔥 Extract the actual user data if nested inside "user"
  const updateData = data.user ? { ...data.user } : { ...data };

  // 🔹 Ensure nested updates work correctly
  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true, // Return updated document
    runValidators: true, // Ensure validation rules apply
  });

  return updatedUser;
};

const changeActivityIntoDB = async (
  id: string,
  payload: { isActive: boolean },
) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteUserIntoDB = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // If the user is a landlord, we need to delete or update all of their rental houses
  if (user.role === 'landlord') {
    // Option 1: Delete all rental houses created by this landlord
    await RentalListing.deleteMany({ landlordId: userId });

    await User.findByIdAndDelete(userId);
    return {
      message:
        'Landlord deleted successfully along with all their rental houses',
    };
  }

  return user;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = async (userid: string, role: string) => {
  // Correct parameter name
  const result = await User.findById(userid); // Use correct variable
  return result;
};

/**
 * Update a user's role.
 * - Allows conversion of tenants to landlords (or vice versa) or promoting a user to admin.
 * - Prevents demoting an admin to a non-admin role.
 */
const updateUserRoleIntoDB = async (
  userId: string,
  newRole: 'admin' | 'landlord' | 'tenant',
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // If the current user is an admin and the new role is not admin, do not allow change.
  if (user.role === 'admin' && newRole !== 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot change another admin’s role',
    );
  }

  // Otherwise, update the role
  user.role = newRole;
  const updatedUser = await user.save();
  return updatedUser;
};

const getSingleUserIntoDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }
  if (user.isActive === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is in-active');
  }
  return user;
};

export const UserServices = {
  // createUserIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
  changeActivityIntoDB,
  getMe,
  deleteUserIntoDB,
  updateUserRoleIntoDB,
  getSingleUserIntoDB,
};
