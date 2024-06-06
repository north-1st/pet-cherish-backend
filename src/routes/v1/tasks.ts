import express from 'express';

import { createTask, deleteTask, getTasksByQuery, getTasksByUser, updateTask } from '@controllers/tasks';
import requiresAuth from '@middlewares/requiresAuth';
import { validateRequest } from '@middlewares/validateRequest';
import {
  createTaskRequestSchema,
  deleteTaskRequestSchema,
  getTasksByQueryRequestSchema,
  getTasksByUserRequestSchema,
  updateTaskRequestSchema,
} from '@schema/task';

const router = express.Router();

router.post('/tasks', requiresAuth, requiresAuth, validateRequest(createTaskRequestSchema), createTask);
router.patch('/tasks/:task_id', requiresAuth, validateRequest(updateTaskRequestSchema), updateTask);
router.delete('/tasks/:task_id', requiresAuth, validateRequest(deleteTaskRequestSchema), deleteTask);
router.get('/users/:user_id/tasks', validateRequest(getTasksByUserRequestSchema), getTasksByUser);
router.get('/tasks', validateRequest(getTasksByQueryRequestSchema), getTasksByQuery);

export default router;
