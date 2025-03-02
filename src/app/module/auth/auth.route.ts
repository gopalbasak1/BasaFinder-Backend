import express from 'express';
import { AuthControllers } from './auth.controller';
import validationRequest from '../../middleware/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthValidation } from './auth.Validation';
import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  validationRequest(UserValidation.createUser),
  AuthControllers.register,
);

router.post(
  '/login',
  validationRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  validationRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
