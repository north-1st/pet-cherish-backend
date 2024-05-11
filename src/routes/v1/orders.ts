import { Router } from 'express';

import * as OrderControllers from '@controllers/orders';

const {
  createOrder,
  updateOrdersByRefuseSitter,
  updateOrdersByAcceptSitter,
  updateOrdersByPaid,
  updateOrdersByComplete,
  updateOrdersByCancel,
  getPetOwnerOrders,
  getSitterOrders,
} = OrderControllers;

const router = Router();
// 之後要補 User 登入檢查的 middleware，還要同時回傳 user_id 給 controller 使用
router.post('/', createOrder);
router.patch('/:order_id/refuse-sitter', updateOrdersByRefuseSitter);
router.patch('/:order_id/accept-sitter', updateOrdersByAcceptSitter);
router.patch('/:order_id/paid', updateOrdersByPaid);
router.patch('/:order_id/complete', updateOrdersByComplete);
router.patch('/:order_id/cancel', updateOrdersByCancel);

// 同步討論：Route 配置
router.get('/pet-owner-orders', getPetOwnerOrders);
router.get('/sitter-orders', getSitterOrders);

export default router;
