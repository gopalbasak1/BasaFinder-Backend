import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import validationRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/admin', auth(USER_ROLE.admin), UserController.getAllUsers);

router.patch(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  validationRequest(UserValidation.updateUser),
  UserController.updateUser,
);

router.post(
  '/admin/change-status/:id',
  auth(USER_ROLE.admin),
  validationRequest(UserValidation.changeActivityStatusValidationSchema),
  UserController.changeActivity,
);

router.delete(
  '/admin/:userId',
  auth(USER_ROLE.admin), // Only admins can delete users
  UserController.deleteUser,
);

router.get(
  '/me',
  auth(USER_ROLE.landlord, USER_ROLE.tenant, USER_ROLE.admin),
  UserController.getMe,
);

export const UserRoute = router;
