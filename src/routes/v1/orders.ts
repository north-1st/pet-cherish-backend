import { Router } from 'express';

import {
  acceptSitter,
  cancelOrder,
  completeOrder,
  createOrder,
  getOrderById,
  getPetOwnerOrders,
  getReportByOrderId,
  getSitterOrders,
  payforOrder,
  refuseSitter,
  updatePaymentStatusOrder,
  updateReport,
} from '@controllers/orders';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import {
  createOrderRequestSchema,
  orderByIdRequestSchema,
  ordersQuerySchema,
  ordersRequestSchema,
  ownerOrdersRequestSchema,
  payforOrderRequestSchema,
  reportBodySchema,
  updatePaymentStatusOrderRequestSchema,
} from '@schema/orders';

const router = Router();
router.post('/', requiresAuth, validateRequest(createOrderRequestSchema), createOrder);

router.patch('/:order_id/refuse-sitter', requiresAuth, validateRequest(ordersRequestSchema), refuseSitter);
router.patch('/:order_id/accept-sitter', requiresAuth, validateRequest(ordersRequestSchema), acceptSitter);
router.patch('/:order_id/payment', requiresAuth, validateRequest(payforOrderRequestSchema), payforOrder);
router.patch(
  '/:order_id/paid',
  requiresAuth,
  validateRequest(updatePaymentStatusOrderRequestSchema),
  updatePaymentStatusOrder
);
router.patch('/:order_id/complete', requiresAuth, validateRequest(ordersRequestSchema), completeOrder);
router.patch('/:order_id/cancel', requiresAuth, validateRequest(ordersRequestSchema), cancelOrder);

router.get('/pet-owner', requiresAuth, validateRequest(ordersQuerySchema), getPetOwnerOrders);
router.get('/sitter', requiresAuth, validateRequest(ordersQuerySchema), getSitterOrders);
router.get('/:order_id', requiresAuth, validateRequest(orderByIdRequestSchema), getOrderById);

router
  .route('/:order_id/report')
  .get(getReportByOrderId)
  .patch(requiresAuth, validateRequest(reportBodySchema), updateReport);

export default router;
