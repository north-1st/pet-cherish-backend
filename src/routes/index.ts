import express from 'express';

import commentsV1 from '@routes/v1/comments';
import homeV1 from '@routes/v1/home';
import ordersV1 from '@routes/v1/orders';
import paymentV1 from '@routes/v1/payment';
import petsV1 from '@routes/v1/pets';
import reviewV1 from '@routes/v1/reviews';
import sitterV1 from '@routes/v1/sitters';
import tasksV1 from '@routes/v1/tasks';
import uploadV1 from '@routes/v1/upload';
import usersV1 from '@routes/v1/users';

const router = express();

router.use('/v1/orders', ordersV1);
router.use('/v1/upload', uploadV1);
router.use('/v1/users', usersV1);
router.use('/v1', sitterV1);
router.use('/v1', petsV1);
router.use('/v1', tasksV1);
router.use('/v1', reviewV1);
router.use('/v1', commentsV1);
router.use('/v1/payment', paymentV1);
router.use('/v1/home', homeV1);

export default router;
