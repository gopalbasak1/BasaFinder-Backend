"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRental = void 0;
// rentalRequest.routes.ts
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("../user/user.constant");
const request_controller_1 = require("./request.controller");
const router = (0, express_1.Router)();
// Tenant endpoints: Create a new request and get tenant's requests
router.post('/tenants/requests', (0, auth_1.auth)(user_constant_1.USER_ROLE.tenant), request_controller_1.RentalRequestController.createRentalRequest);
router.get('/tenants/requests', (0, auth_1.auth)(user_constant_1.USER_ROLE.tenant), request_controller_1.RentalRequestController.getRentalRequestsByTenant);
// Landlord endpoints: Get all requests for listings posted by the landlord and update a request (approve/reject)
router.get('/landlords/requests', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), request_controller_1.RentalRequestController.getRentalRequestsByLandlord);
router.put('/landlords/requests/:requestId', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), request_controller_1.RentalRequestController.updateRentalRequest);
router.post('/pay-rental-request', (0, auth_1.auth)(user_constant_1.USER_ROLE.tenant), // Ensure user is authenticated
request_controller_1.RentalRequestController.payRentalRequest);
router.post('/verify', (0, auth_1.auth)(user_constant_1.USER_ROLE.tenant), request_controller_1.RentalRequestController.verifyPayment);
router.get('/admin/requests', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), request_controller_1.RentalRequestController.getAllRentalRequestByAdmin);
exports.RequestRental = router;
