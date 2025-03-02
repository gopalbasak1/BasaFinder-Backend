import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppErrors';
import { User } from '../user/user.model';
import { productSearchableFields } from './product.constant';
import { IBike } from './product.interface';
import Product from './product.model';
import httpStatus from 'http-status-codes';

//1. Create a Bike
const createABike = async (email: string, payload: IBike): Promise<IBike> => {
  // 🔹 Fetch user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // 🔹 Attach user ID to payload
  payload.user = user._id;
  payload.inStock = payload.totalQuantity > 0; // ✅ Assign the correct ObjectId

  // 🔹 Create new product with user reference
  const result = await Product.create(payload);
  return result;
};

//2. Get All Bikes
const getAllBikes = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return {
    meta,
    result,
  };
};

//3. Get a Specific Bike
const getSpecificBikes = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

//4. Update a Bike
const updateBike = async (id: string, data: Partial<IBike>) => {
  // Ensure `inStock` updates based on quantity
  if (data.totalQuantity !== undefined) {
    data.inStock = data.totalQuantity > 0;
  }

  const result = await Product.findByIdAndUpdate(id, data, { new: true });
  return result;
};

//5. Delete a Bike
const deleteBike = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const productService = {
  createABike,
  getAllBikes,
  getSpecificBikes,
  updateBike,
  deleteBike,
};
