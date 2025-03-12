"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRoute = void 0;
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("./address.controller");
const router = express_1.default.Router();
router.post('/create-address', address_controller_1.AddressController.createAddress);
router.get('/', address_controller_1.AddressController.getAllAddresses);
exports.AddressRoute = router;
