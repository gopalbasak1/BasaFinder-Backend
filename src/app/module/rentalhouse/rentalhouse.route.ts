import express from 'express';
import { RentalListingController } from './rentalhouse.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import validationRequest from '../../middleware/validateRequest';
import { RentalHouseValidation } from './rentalhouse.validation';

const router = express.Router();

router.post(
  '/landlords/listings',
  auth(USER_ROLE.landlord),
  validationRequest(RentalHouseValidation.createRentalListingValidationSchema),
  RentalListingController.createRentalHouse,
);

router.get(
  '/admin/landlords/listings',
  auth(USER_ROLE.admin),
  RentalListingController.getAllRental,
);

router.get(
  '/landlords/listings',
  auth(USER_ROLE.landlord),
  RentalListingController.getMyRental,
);

router.patch(
  '/landlords/listings/:rentalId',
  auth(USER_ROLE.landlord), // Only landlords can update
  validationRequest(RentalHouseValidation.updateRentalListingValidationSchema),
  RentalListingController.updateRentalByLandlord,
);

router.put(
  '/admin/listings/:rentalId',
  auth(USER_ROLE.admin), // Only admin can update
  validationRequest(RentalHouseValidation.updateRentalListingValidationSchema),
  RentalListingController.updateRentalByAdmin,
);

router.delete(
  '/landlords/listings/:rentalId',
  auth(USER_ROLE.landlord), // Only admin can update

  RentalListingController.deleteRentalByLandlord,
);

router.delete(
  '/admin/listings/:rentalId',
  auth(USER_ROLE.admin), // Only admin can update

  RentalListingController.deleteRentalByAdmin,
);

router.get(
  '/listings/:rentalId',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant), // Only admin can update

  RentalListingController.getSingleRental,
);

router.get('/listings', RentalListingController.getAllRentalListings);

export const RentalRoute = router;
