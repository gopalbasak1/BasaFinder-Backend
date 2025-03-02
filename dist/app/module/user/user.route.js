"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleware/auth");
const user_constant_1 = require("./user.constant");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
// router.post(
//   '/create-user',
//   validationRequest(UserValidation.createUser),
//   UserController.createUser,
// );
router.get('/', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), user_controller_1.UserController.getAllUsers);
router.patch('/:userId', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.customer), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUser), user_controller_1.UserController.updateUser);
router.post('/change-status/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.UserController.changeStatus);
router.get('/me', (0, auth_1.auth)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.admin), user_controller_1.UserController.getMe);
exports.UserRoute = router;
