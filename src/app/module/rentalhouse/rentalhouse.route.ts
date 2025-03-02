import express from 'express';
import { RentalListingController } from './rentalhouse.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/landlords/listings',
  auth(USER_ROLE.landlord),
  RentalListingController.createRentalHouse,
);

router.get(
  '/admin/landlords/listings',
  auth(USER_ROLE.admin),
  RentalListingController.getAllRental,
);

export const RentalRoute = router;
