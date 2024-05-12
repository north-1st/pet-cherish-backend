import { Router } from 'express';

import {
  createOrder,
  getPetOwnerOrders,
  getSitterOrders,
  updateOrdersByAcceptSitter,
  updateOrdersByCancel,
  updateOrdersByComplete,
  updateOrdersByPaid,
  updateOrdersByRefuseSitter,
} from '@controllers/orders';
import { validateRequest } from '@middlewares/validateRequest';
import { orderBodySchema } from '@schema/orders';

const router = Router();
// 之後要補 User 登入檢查的 middleware，還要同時回傳 user_id 給 controller 使用
router.post(
  '/',
  /*  #swagger.parameters['body'] = {
          in: 'body',
          description: '建立訂單',
          schema: { 
            user_id: "'663fd8ce5eeb13779e3a2f76'", 
            task_id: "456" 
          }
      } 
  */ validateRequest(orderBodySchema),
  createOrder
);
router.patch('/:order_id/refuse-sitter', validateRequest(orderBodySchema), updateOrdersByRefuseSitter);
router.patch('/:order_id/accept-sitter', validateRequest(orderBodySchema), updateOrdersByAcceptSitter);
router.patch('/:order_id/paid', validateRequest(orderBodySchema), updateOrdersByPaid);
router.patch('/:order_id/complete', validateRequest(orderBodySchema), updateOrdersByComplete);
router.patch('/:order_id/cancel', validateRequest(orderBodySchema), updateOrdersByCancel);

router.get('/pet-owner', getPetOwnerOrders);
router.get('/sitter', getSitterOrders);

export default router;
