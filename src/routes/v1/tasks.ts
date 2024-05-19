import express from 'express';

import * as TasksController from '@controllers/tasks';
import * as s from '@middlewares/swaggers/tasks';

const router = express.Router();

router.get('/', TasksController.getTasks, s.getTasks);
router
  .route('/:task_id/review')
  .post(TasksController.createReview, s.createReview)
  .patch(TasksController.updateReview, s.updateReview);

export default router;
