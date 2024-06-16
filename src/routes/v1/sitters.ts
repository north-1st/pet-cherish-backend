import express from 'express';

import {
  applySitter,
  getSitterService,
  getSitterServiceList,
  sitterApprove,
  sitterReject,
  updateSitterApplication,
  updateSitterService,
} from '@controllers/sitters';
import isExistingSitter from '@middlewares/isExistingSitter';
import isExistingUser from '@middlewares/isExistingUser';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import {
  applySitterRequestSchema,
  sitterRequestQuerySchema,
  sitterRequestSchema,
  updateSitterServiceRequestSchema,
} from '@schema/sitter';

const router = express.Router();

router
  .route('/apply-sitter')
  .post(requiresAuth, validateRequest(applySitterRequestSchema), applySitter)
  .patch(requiresAuth, validateRequest(applySitterRequestSchema), updateSitterApplication);

router.patch('/sitters', requiresAuth, validateRequest(updateSitterServiceRequestSchema), updateSitterService);

router.patch(
  '/sitters/:user_id/approve',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  isExistingUser,
  sitterApprove
);

router.patch(
  '/sitters/:user_id/reject',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  isExistingUser,
  sitterReject
);

router.get('/sitters/:user_id', validateRequest(sitterRequestSchema), isExistingSitter, getSitterService);

router.get('/sitters', validateRequest(sitterRequestQuerySchema), getSitterServiceList);

export default router;
