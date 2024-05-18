import express from 'express';

import { applySitter, getSitterService, sitterApprove, sitterReject, updateSitterService } from '@controllers/sitters';
import * as s from '@middlewares/swaggers/sitters';
import { validateRequest } from '@middlewares/validateRequest';
import { applySitterRequestSchema, sitterRequestSchema, updateSitterServiceRequestSchema } from '@schema/sitter';

const router = express.Router();

router.post('/apply-sitter', validateRequest(applySitterRequestSchema), applySitter, s.applySitter);
router.get('/sitters/:user_id', validateRequest(sitterRequestSchema), getSitterService, s.getSitterService);
router.patch('/sitters', validateRequest(updateSitterServiceRequestSchema), updateSitterService, s.updateSitterService);

router.patch('/sitters/:user_id/approve', validateRequest(sitterRequestSchema), sitterApprove, s.sitterApprove);
router.patch('/sitters/:user_id/reject', validateRequest(sitterRequestSchema), sitterReject, s.sitterReject);

export default router;
