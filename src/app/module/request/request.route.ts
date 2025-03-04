// rentalRequest.routes.ts
import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { RentalRequestController } from './request.controller';

const router = Router();

// Tenant endpoints: Create a new request and get tenant's requests
router.post(
  '/tenants/requests',
  auth(USER_ROLE.tenant),
  RentalRequestController.createRentalRequest,
);
router.get(
  '/tenants/requests',
  auth(USER_ROLE.tenant),
  RentalRequestController.getRentalRequestsByTenant,
);

// Landlord endpoints: Get all requests for listings posted by the landlord and update a request (approve/reject)
router.get(
  '/landlords/requests',
  auth(USER_ROLE.landlord),
  RentalRequestController.getRentalRequestsByLandlord,
);
router.put(
  '/landlords/requests/:requestId',
  auth(USER_ROLE.landlord),
  RentalRequestController.updateRentalRequest,
);

router.post(
  '/pay-rental-request',
  auth(USER_ROLE.tenant), // Ensure user is authenticated
  RentalRequestController.payRentalRequest,
);

router.post(
  '/verify',
  auth(USER_ROLE.tenant),
  RentalRequestController.verifyPayment,
);

router.get(
  '/admin/requests',
  auth(USER_ROLE.admin),
  RentalRequestController.getAllRentalRequestByAdmin,
);

export const RequestRental = router;
