import AppError from '../../errors/AppErrors';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';

const registerFromDB = async (password: string, payload: TUser) => {
  const result = await User.create(payload);

  return result;
};

const login = async (payload: TLoginUser) => {
  // Validate the existence of the JWT secret
  if (!config.jwt_access_secret) {
    throw new Error('JWT secret is not defined in the configuration.');
  }

  // Check if either email or phoneNumber is provided
  let query = {};
  if (payload?.email) {
    query = { email: payload.email };
  } else if (payload?.phoneNumber) {
    query = { phoneNumber: payload.phoneNumber };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email or phone number is required!',
    );
  }

  // Is User exists checking
  const user = await User.findOne(query).select('+password');

  //console.log(user);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found !');

  if (user?.isDeleted === false)
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted !');

  // Is User block checking
  const isUserStatus = user?.status;
  //console.log(isUserBlocked);
  if (isUserStatus === 'blocked')
    throw new AppError(httpStatus.FORBIDDEN, 'This user is block !');

  //checking if the password is correct
  const isMatch = await bcrypt.compare(payload?.password, user?.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password!');
  }
  //console.log(user.fullName);
  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
    image: user?.image,
    name: user?.name,
    isActive: user?.isActive,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload | undefined, // Accept undefined for unauthenticated users
  payload: { oldPassword: string; newPassword: string },
) => {
  if (!userData) {
    throw new AppError(401, 'User is not authenticated.');
  }

  let query = {};

  if (userData?.email) {
    query = { email: userData?.email };
  } else if (userData?.phoneNumber) {
    query = { phoneNumber: userData?.phoneNumber };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email or phone number is required.',
    );
  }

  // Find user by email (or use userData.id if available)
  const user = await User.findOne(query).select('+password');

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  // Ensure user is not deleted
  if (user.isDeleted === false) {
    throw new AppError(403, 'This user is deleted.');
  }

  // Ensure user is not blocked
  if (user.status === 'blocked') {
    throw new AppError(403, 'This user is blocked.');
  }

  // Check if the old password matches
  if (!user.password) {
    throw new AppError(500, 'Password not found for user.');
  }

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(401, 'Old password is incorrect.');
  }

  // Hash the new password
  const saltRounds = Number(config.bcrypt_salt_rounds) || 12; // Default to 12 rounds if not set
  const newHashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

  // Update the user's password and set passwordChangedAt
  const updatedUser = await User.findOneAndUpdate(
    query,
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError(500, 'Password update failed.');
  }

  return {
    message: 'Password updated successfully.',
  };
};

const refreshToken = async (token: string) => {
  //checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  // Decoding the refresh token
  const { email, phoneNumber, iat } = decoded;

  // Create a query to find the user by either email or phoneNumber
  let query = {};
  if (email) {
    query = { email };
  } else if (phoneNumber) {
    query = { phoneNumber };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email or phone number is required!',
    );
  }

  // Fetch the user based on either email or phoneNumber
  const user = await User.findOne(query);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted === false) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  // Check if the password has been changed after the token was issued
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  // Prepare the payload for the new access token
  const jwtPayload = {
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
    image: user?.image,
  };

  // Create the new access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  registerFromDB,
  login,
  changePassword,
  refreshToken,
};
