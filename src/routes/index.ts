import express from 'express';

import tasksV1 from '@routes/v1/tasks';
import usersV1 from '@routes/v1/users';

const router = express();

router.use('/v1/users', usersV1);
router.use('/v1/tasks', tasksV1);

export default router;
