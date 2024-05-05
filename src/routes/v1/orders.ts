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

router.post('/orders', createOrder);
router.patch('/orders/:order_id/refuse-sitter', updateOrdersByRefuseSitter);
router.patch('/orders/:order_id/accept-sitter', updateOrdersByAcceptSitter);
router.patch('/orders/:order_id/paid', updateOrdersByPaid);
router.patch('/orders/:order_id/complete', updateOrdersByComplete);
router.patch('/orders/:order_id/cancel', updateOrdersByCancel);

router.get('/pet-owner-orders', getPetOwnerOrders);
router.get('/sitter-orders', getSitterOrders);

export default router;
