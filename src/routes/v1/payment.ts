import express from 'express';

import { checkout, complete } from '@controllers/payment';
import { validateRequest } from '@middlewares/validateRequest';
import { checkoutRequestSchema, completeRequestSchema } from '@schema/payment';

const router = express.Router();

router.post('/checkout', validateRequest(checkoutRequestSchema), checkout);
router.get('/complete', validateRequest(completeRequestSchema), complete);

export default router;
