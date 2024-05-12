import express from 'express';

import { applySitter, getSitterService, sitterApprove, sitterReject, updateSitterService } from '@controllers/sitters';
import { validateRequest } from '@middlewares/validateRequest';
import { applySitterRequestSchema, sitterRequestSchema, updateSitterServiceRequestSchema } from '@schema/sitter';

const router = express.Router();

router.post('/apply-sitter', validateRequest(applySitterRequestSchema), applySitter);
router.get('/sitters/:user_id', validateRequest(sitterRequestSchema), getSitterService);
router.patch('/sitters', validateRequest(updateSitterServiceRequestSchema), updateSitterService);

router.patch('/sitters/:user_id/approve', validateRequest(sitterRequestSchema), sitterApprove);
router.patch('/sitters/:user_id/reject', validateRequest(sitterRequestSchema), sitterReject);

export default router;
