/* eslint-disable no-unused-vars */

import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  role: 'admin' | 'landlord' | 'tenant';
  email: string;
  phoneNumber: string;
  image?: string;
  password: string;
  needsPasswordChange: boolean;
  isListings?: boolean;
  passwordChangedAt?: Date;
  status: 'in-progress' | 'blocked';
  lastLogin: Date;
  isActive: boolean;
  isDeleted: boolean;
};
export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  // Method for checking if a user exists by their MongoDB ObjectId
  //isUserExistsById(id: string): Promise<TUser | null>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
