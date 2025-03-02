/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppErrors';
import httpStatus from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../module/user/user.model';
import { TUserRole } from '../module/user/user.interface';
import config from '../config';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Verify the token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    // const { role, email, iat } = decoded;

    // Find the user by email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    //console.log('User Role:', user.role);

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        decoded.iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Token issued before password change',
      );
    }

    // Ensure the user has the required role
    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role as TUserRole)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Attach the full user details to `req.user`
    req.user = {
      id: user._id.toString(),
      role: user.role as 'admin' | 'customer',
      email: user.email,
      image: user.image,
      name: user.name,
    };

    //console.log('Authenticated User:', req.user);

    next();
  });
};
