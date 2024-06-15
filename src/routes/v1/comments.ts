import express from 'express';

import { createComment, deleteComment, getCommentReplies, getComments, updateComment } from '@controllers/comments';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import {
  createCommentRequestSchema,
  deleteCommentRequestSchema,
  getCommentRepliesRequestSchema,
  getCommentsRequestSchema,
  updateCommentRequestSchema,
} from '@schema/comments';

const router = express.Router();

router.post('/tasks/:task_id/comments', requiresAuth, validateRequest(createCommentRequestSchema), createComment);
router.get('/tasks/:task_id/comments', validateRequest(getCommentsRequestSchema), getComments);

router.get('/comments/:comment_id/replies', validateRequest(getCommentRepliesRequestSchema), getCommentReplies);
router.patch('/comments/:comment_id', requiresAuth, validateRequest(updateCommentRequestSchema), updateComment);
router.delete('/comments/:comment_id', requiresAuth, validateRequest(deleteCommentRequestSchema), deleteComment);

export default router;
