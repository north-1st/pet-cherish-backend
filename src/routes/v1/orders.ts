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
  payForOrder,
  refuseSitter,
  updateReport,
} from '@controllers/orders';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import {
  createOrderRequestSchema,
  orderByIdRequestSchema,
  orderRequestSchema,
  ownerOrdersRequestSchema,
  reportBodySchema,
  sitterOrdersRequestSchema,
} from '@schema/orders';

const router = Router();
router.post('/', requiresAuth, validateRequest(createOrderRequestSchema), createOrder);

router.patch('/:order_id/refuse-sitter', requiresAuth, validateRequest(orderRequestSchema), refuseSitter);
router.patch('/:order_id/accept-sitter', requiresAuth, validateRequest(orderRequestSchema), acceptSitter);
router.patch('/:order_id/paid', requiresAuth, validateRequest(orderRequestSchema), payForOrder);
router.patch('/:order_id/complete', requiresAuth, validateRequest(orderRequestSchema), completeOrder);
router.patch('/:order_id/cancel', requiresAuth, validateRequest(orderRequestSchema), cancelOrder);

router.get('/pet-owner', requiresAuth, validateRequest(ownerOrdersRequestSchema), getPetOwnerOrders);
router.get('/sitter', requiresAuth, validateRequest(sitterOrdersRequestSchema), getSitterOrders);
router.get('/:order_id', requiresAuth, validateRequest(orderByIdRequestSchema), getOrderById);

router
  .route('/:order_id/report')
  .get(getReportByOrderId)
  .patch(requiresAuth, validateRequest(reportBodySchema), updateReport);

export default router;
