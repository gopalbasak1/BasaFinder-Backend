"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRoute = void 0;
const express_1 = __importDefault(require("express"));
const rentalhouse_controller_1 = require("./rentalhouse.controller");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const rentalhouse_validation_1 = require("./rentalhouse.validation");
const router = express_1.default.Router();
router.post('/landlords/listings', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), (0, validateRequest_1.default)(rentalhouse_validation_1.RentalHouseValidation.createRentalListingValidationSchema), rentalhouse_controller_1.RentalListingController.createRentalHouse);
router.get('/admin/landlords/listings', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), rentalhouse_controller_1.RentalListingController.getAllRental);
router.get('/landlords/listings', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), rentalhouse_controller_1.RentalListingController.getMyRental);
router.patch('/landlords/listings/:rentalId', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), // Only landlords can update
(0, validateRequest_1.default)(rentalhouse_validation_1.RentalHouseValidation.updateRentalListingValidationSchema), rentalhouse_controller_1.RentalListingController.updateRentalByLandlord);
router.put('/admin/listings/:rentalId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), // Only admin can update
(0, validateRequest_1.default)(rentalhouse_validation_1.RentalHouseValidation.updateRentalListingValidationSchema), rentalhouse_controller_1.RentalListingController.updateRentalByAdmin);
router.delete('/landlords/listings/:rentalId', (0, auth_1.auth)(user_constant_1.USER_ROLE.landlord), // Only admin can update
rentalhouse_controller_1.RentalListingController.deleteRentalByLandlord);
router.delete('/admin/listings/:rentalId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), // Only admin can update
rentalhouse_controller_1.RentalListingController.deleteRentalByAdmin);
router.get('/listings/:rentalId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.tenant), // Only admin can update
rentalhouse_controller_1.RentalListingController.getSingleRental);
router.get('/listings', rentalhouse_controller_1.RentalListingController.getAllRentalListings);
exports.RentalRoute = router;
