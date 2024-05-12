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
  /*  
    #swagger.tags = ['Orders']
    #swagger.description = '建立訂單'
    #swagger.parameters['obj'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/definitions/CreateOrder'
      }
    }
    #swagger.responses[201] = {
      schema: {
        $ref: '#/definitions/SuccessResult'
      }
    }
  */
  validateRequest(orderBodySchema),
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
