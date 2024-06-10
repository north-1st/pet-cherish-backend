import express from 'express';

import { home } from '@controllers/home';
import { validateRequest } from '@middlewares/validateRequest';
import { homeResponseSchema } from '@schema/home';

const router = express.Router();

router.get('/', validateRequest(homeResponseSchema), home);

export default router;
