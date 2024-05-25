import { Router } from 'express';

import { createReview, getReviewByTaskId, updateReview } from '@controllers/reviews';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import { reviewBodySchema } from '@schema/task';

const router = Router();
router
  .route('/tasks/:task_id/review')
  .get(validateRequest(reviewBodySchema), getReviewByTaskId)
  .post(requiresAuth, validateRequest(reviewBodySchema), createReview)
  .patch(requiresAuth, validateRequest(reviewBodySchema), updateReview);

export default router;
