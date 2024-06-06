import express from 'express';

import {
  applySitter,
  getSitterService,
  getSitterServiceList,
  sitterApprove,
  sitterReject,
  updateSitterService,
} from '@controllers/sitters';
import isExistingSitter from '@middlewares/isExistingSitter';
import isExistingUser from '@middlewares/isExistingUser';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/sitters';
import { validateRequest } from '@middlewares/validateRequest';
import {
  applySitterRequestSchema,
  sitterRequestQuerySchema,
  sitterRequestSchema,
  updateSitterServiceRequestSchema,
} from '@schema/sitter';

const router = express.Router();

router.post('/apply-sitter', requiresAuth, validateRequest(applySitterRequestSchema), applySitter, s.applySitter);

router.patch(
  '/sitters',
  requiresAuth,
  validateRequest(updateSitterServiceRequestSchema),
  isExistingSitter,
  updateSitterService,
  s.updateSitterService
);

router.patch(
  '/sitters/:user_id/approve',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  isExistingUser,
  sitterApprove,
  s.sitterApprove
);

router.patch(
  '/sitters/:user_id/reject',
  requiresAuth,
  validateRequest(sitterRequestSchema),
  isExistingUser,
  sitterReject,
  s.sitterReject
);

router.get(
  '/sitters/:user_id',
  validateRequest(sitterRequestSchema),
  isExistingSitter,
  getSitterService,
  s.getSitterService
);

router.get('/sitters', validateRequest(sitterRequestQuerySchema), getSitterServiceList);

export default router;
