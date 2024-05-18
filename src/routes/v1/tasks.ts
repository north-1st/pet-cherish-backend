import express from 'express';

import * as TasksController from '@controllers/tasks';
import * as s from '@middlewares/swaggers/tasks';

const router = express.Router();

router.get('/', TasksController.getTasks, s.getTasks);
router.post('/:task_id/review', TasksController.createReview, s.createReview);

export default router;
