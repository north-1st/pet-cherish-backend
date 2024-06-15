import express from 'express';

import { getHomeInfo } from '@controllers/home';
import { validateRequest } from '@middlewares/validateRequest';
import { homeResponseSchema } from '@schema/home';

const router = express.Router();

router.get('/', validateRequest(homeResponseSchema), getHomeInfo);

export default router;
