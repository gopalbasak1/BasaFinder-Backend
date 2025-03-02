import express from 'express';
import { AddressController } from './address.controller';

const router = express.Router();

router.post('/create-address', AddressController.createAddress);

router.get('/', AddressController.getAllAddresses);

export const AddressRoute = router;
