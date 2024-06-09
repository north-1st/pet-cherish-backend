import { Router } from 'express';

import { createReview, getOwnerReviews, getReviewByTaskId, getSitterReviews, updateReview } from '@controllers/reviews';
import isExistingSitter from '@middlewares/isExistingSitter';
import isExistingUser from '@middlewares/isExistingUser';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import { getReviewRequestSchema, getReviewsParamSchema, reviewRequestSchema } from '@schema/review';

const router = Router();
router.get('/pet-owners/:user_id/reviews', validateRequest(getReviewsParamSchema), isExistingUser, getOwnerReviews);
router.get('/sitters/:user_id/reviews', validateRequest(getReviewsParamSchema), isExistingSitter, getSitterReviews);
router
  .route('/tasks/:task_id/review')
  .get(validateRequest(getReviewRequestSchema), getReviewByTaskId)
  .post(requiresAuth, validateRequest(reviewRequestSchema), createReview)
  .patch(requiresAuth, validateRequest(reviewRequestSchema), updateReview);

export default router;
