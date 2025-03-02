import express from 'express';
import { UserController } from './user.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import validationRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

// router.post(
//   '/create-user',
//   validationRequest(UserValidation.createUser),
//   UserController.createUser,
// );
router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

router.patch(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  validationRequest(UserValidation.updateUser),
  UserController.updateUser,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validationRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get(
  '/me',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  UserController.getMe,
);

export const UserRoute = router;
