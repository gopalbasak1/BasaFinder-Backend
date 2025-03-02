import { Router } from 'express';
import { productController } from './product.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import validationRequest from '../../middleware/validateRequest';
import { ProductValidation } from './productValidation';

const bikeRouter = Router();

bikeRouter.post(
  '/',
  auth(USER_ROLE.admin),
  validationRequest(ProductValidation.createProduct),
  productController.createABike,
);
bikeRouter.get('/', productController.getAllBikes);
bikeRouter.get('/:productId', productController.getSpecificBikes);
bikeRouter.put(
  '/:productId',
  auth(USER_ROLE.admin),
  validationRequest(ProductValidation.updateProduct),
  productController.updateBike,
);
bikeRouter.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  productController.deleteBike,
);
export default bikeRouter;
