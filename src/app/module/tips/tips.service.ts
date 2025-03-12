import AppError from '../../errors/AppErrors';
import { User } from '../user/user.model';

import QueryBuilder from '../../builder/QueryBuilder';
import { TTips } from './tips.interface';
import Tips from './tips.model';

/**
 * Create a tips
 */
const createTips = async (email: string, payload: TTips) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const newTips = await Tips.create({
    ...payload,
    user: user._id,
  });

  return newTips;
};

/**
 * Get all tipss
 */
const getAllTips = async (query: Record<string, unknown>) => {
  const baseQuery = new QueryBuilder(Tips.find().populate('user'), query);

  const result = await baseQuery.modelQuery;
  const meta = await baseQuery.countTotal();
  return { result, meta };
};

/**
 * Delete a tips (Admin Only)
 */
const deleteTips = async (tipsId: string) => {
  const tips = await Tips.findById(tipsId);
  if (!tips) throw new AppError(404, 'tips not found');

  await Tips.findByIdAndDelete(tipsId);
  return { message: 'tips deleted successfully' };
};

export const tipsServices = {
  createTips,
  getAllTips,
  deleteTips,
};
