import express from 'express';

import { ordersMiddleware, petsMiddleware, tasksMiddleware, usersMiddleware } from '@middlewares/tagMiddleware';
import ordersV1 from '@routes/v1/orders';
import petsV1 from '@routes/v1/pets';
import tasksV1 from '@routes/v1/tasks';
import usersV1 from '@routes/v1/users';

const router = express();

router.use('/v1/orders', ordersMiddleware, ordersV1);
router.use('/v1/users', usersMiddleware, usersV1);
router.use('/v1/pets', petsMiddleware, petsV1);
router.use('/v1/tasks', tasksMiddleware, tasksV1);

export default router;
