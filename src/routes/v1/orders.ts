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
import { validateRequest } from '@middlewares/validateRequest';
import { orderBodySchema } from '@schema/orders';

const router = Router();
// 之後要補 User 登入檢查的 middleware，還要同時回傳 user_id 給 controller 使用
router.post('/', validateRequest(orderBodySchema), createOrder);
router.patch('/:order_id/refuse-sitter', validateRequest(orderBodySchema), refuseSitter);
router.patch('/:order_id/accept-sitter', validateRequest(orderBodySchema), acceptSitter);
router.patch('/:order_id/paid', validateRequest(orderBodySchema), payForOrder);
router.patch('/:order_id/complete', validateRequest(orderBodySchema), completeOrder);
router.patch('/:order_id/cancel', validateRequest(orderBodySchema), cancelOrder);

router.get('/pet-owner', getPetOwnerOrders);
router.get('/sitter', getSitterOrders);

export default router;
