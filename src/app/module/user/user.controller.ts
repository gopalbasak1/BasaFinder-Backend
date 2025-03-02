import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { UserServices } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  //console.log(req.cookies);
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params; // Extract userId from request URL
  const updatedUser = await UserServices.updateUserIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

const changeActivity = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeActivityIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // Check if req.user is defined
  if (!req.user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized: No user found',
      data: null,
    });
  }

  const { userId } = req.params; // Get the userId from the request params
  const loggedInUserId = req.user.id; // Get the logged-in user's ID from the request (from auth middleware)

  // Check if the logged-in user is an admin trying to delete themselves
  if (req.user.role === 'admin' && loggedInUserId === userId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Admin cannot delete their own account',
      data: null,
    });
  }

  // Call the service to delete the user
  const result = await UserServices.deleteUserIntoDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized: No user found',
      data: null,
    });
  }
  const { id, role } = req.user;
  const result = await UserServices.getMe(id, role); // Pass the correct parameters

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

export const UserController = {
  //createUser,
  getAllUsers,
  updateUser,
  changeActivity,
  deleteUser,
  getMe,
};
