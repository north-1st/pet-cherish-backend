import { Router } from 'express';

import { createReview, getOwnerReviews, getReviewByTaskId, getSitterReviews, updateReview } from '@controllers/reviews';
import isExistingSitter from '@middlewares/isExistingSitter';
import isExistingUser from '@middlewares/isExistingUser';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import { reviewBodySchema } from '@schema/review';

const router = Router();
router.get('/pet-owners/{user_id}/reviews', isExistingUser, getOwnerReviews);
router.get('/sitters/{user_id}/reviews', isExistingSitter, getSitterReviews);
router
  .route('/tasks/:task_id/review')
  .get(validateRequest(reviewBodySchema), getReviewByTaskId)
  .post(requiresAuth, validateRequest(reviewBodySchema), createReview)
  .patch(requiresAuth, validateRequest(reviewBodySchema), updateReview);

export default router;
