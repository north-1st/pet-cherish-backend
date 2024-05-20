import express from 'express';

import { applySitter, getSitterService, sitterApprove, sitterReject, updateSitterService } from '@controllers/sitters';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/sitters';
import { validateRequest } from '@middlewares/validateRequest';
import { applySitterRequestSchema, sitterRequestSchema, updateSitterServiceRequestSchema } from '@schema/sitter';

const router = express.Router();

router.post('/apply-sitter', requiresAuth, validateRequest(applySitterRequestSchema), applySitter, s.applySitter);

router.patch(
  '/sitters',
  requiresAuth,
  validateRequest(updateSitterServiceRequestSchema),
  updateSitterService,
  s.updateSitterService
);

router.patch(
  '/sitters/:user_id/approve',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  sitterApprove,
  s.sitterApprove
);
router.patch(
  '/sitters/:user_id/reject',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  sitterReject,
  s.sitterReject
);

router.get('/sitters/:user_id', validateRequest(sitterRequestSchema), getSitterService, s.getSitterService);

export default router;
