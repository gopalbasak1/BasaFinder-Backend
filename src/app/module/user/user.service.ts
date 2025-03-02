/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import QueryBuilder from '../../builder/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

// const createUserIntoDB = async (password: string, payload: TUser) => {
//   const existing = await User.findOne({ email: payload?.email });

//   if (existing) {
//     throw new AppError(httpStatus.CONFLICT, 'User already exists');
//   }

//   const userData: Partial<TUser> = { ...payload };
//   userData.password = password || (config.default_password as string);

//   const result = await User.create(userData);
//   console.log(result);
//   return result;
// };

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

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
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
  changeStatus,
  getMe,
};
