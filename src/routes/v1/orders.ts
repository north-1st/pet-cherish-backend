import { Router } from 'express';

import {
  acceptSitter,
  cancelOrder,
  completeOrder,
  createOrder,
  getPetOwnerOrders,
  getSitterOrders,
  payForOrder,
  refuseSitter,
} from '@controllers/orders';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import { orderBodySchema } from '@schema/orders';

const router = Router();
// 之後要補 User 登入檢查的 middleware，還要同時回傳 user_id 給 controller 使用
router.post('/', requiresAuth, validateRequest(orderBodySchema), createOrder);
router.patch('/:order_id/refuse-sitter', requiresAuth, validateRequest(orderBodySchema), refuseSitter);
router.patch('/:order_id/accept-sitter', requiresAuth, validateRequest(orderBodySchema), acceptSitter);
router.patch('/:order_id/paid', requiresAuth, validateRequest(orderBodySchema), payForOrder);
router.patch('/:order_id/complete', requiresAuth, validateRequest(orderBodySchema), completeOrder);
router.patch('/:order_id/cancel', requiresAuth, validateRequest(orderBodySchema), cancelOrder);

router.get('/pet-owner', getPetOwnerOrders);
router.get('/sitter', getSitterOrders);

export default router;
