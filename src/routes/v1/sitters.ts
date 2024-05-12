import express from 'express';

import { applySitter, getSitterService, updateSitterService } from '@controllers/sitters';
import { validateRequest } from '@middlewares/validateRequest';
import {
  applySitterRequestSchema,
  getSitterServiceRequestSchema,
  updateSitterServiceRequestSchema,
} from '@schema/sitter';

const router = express.Router();

router.post('/apply-sitter', validateRequest(applySitterRequestSchema), applySitter);
router.get('/sitters/:user_id', validateRequest(getSitterServiceRequestSchema), getSitterService);
router.patch('/sitters', validateRequest(updateSitterServiceRequestSchema), updateSitterService);

export default router;
