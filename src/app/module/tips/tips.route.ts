import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { tipsController } from './tips.controller';

const router = Router();

router.post(
  '/create-tips',
  auth(USER_ROLE.admin, USER_ROLE.tenant, USER_ROLE.landlord),
  tipsController.createTips,
);

router.get('/', tipsController.getAllTips);
router.delete('/tips/:id', tipsController.deleteTips);

export const TipsRouter = router;
