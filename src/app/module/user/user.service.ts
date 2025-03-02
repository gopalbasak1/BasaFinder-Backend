/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import QueryBuilder from '../../builder/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

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

  // Perform the deletion (Mark as deleted instead of physically removing from DB)
  user.isDeleted = false;
  await user.save();

  return user;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMe = async (userid: string, role: string) => {
  // Correct parameter name
  const result = await User.findById(userid); // Use correct variable
  return result;
};

export const UserServices = {
  // createUserIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
  changeActivityIntoDB,
  getMe,
  deleteUserIntoDB,
};
