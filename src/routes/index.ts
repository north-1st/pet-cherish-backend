import express from 'express';

import { sitterMiddleware, tasksMiddleware, usersMiddleware } from '@middlewares/tagMiddleware';
import ordersV1 from '@routes/v1/orders';
import petsV1 from '@routes/v1/pets';
import sitterV1 from '@routes/v1/sitters';
import tasksV1 from '@routes/v1/tasks';
import uploadV1 from '@routes/v1/upload';
import usersV1 from '@routes/v1/users';

const router = express();

router.use('/v1/orders', ordersV1);
router.use('/v1/upload', uploadV1);
router.use('/v1/users', usersMiddleware, usersV1);
router.use('/v1', sitterMiddleware, sitterV1);
router.use('/v1', petsV1);
router.use('/v1/tasks', tasksMiddleware, tasksV1);

export default router;
