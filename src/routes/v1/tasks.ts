import express from 'express';

import * as TasksController from '@controllers/tasks';
import { createTask, deleteTask, getUserTasks, updateTask } from '@controllers/tasks';
import requiresAuth from '@middlewares/requiresAuth';
import * as s from '@middlewares/swaggers/tasks';
import { validateRequest } from '@middlewares/validateRequest';
import { createTaskRequestSchema, getTasksByUserRequestSchema, updateTaskRequestSchema } from '@schema/task';

const router = express.Router();

router.get('/users/:user_id/tasks', validateRequest(getTasksByUserRequestSchema), getUserTasks);
router.post('/tasks', requiresAuth, requiresAuth, validateRequest(createTaskRequestSchema), createTask);
router.patch('/tasks/:task_id', requiresAuth, validateRequest(updateTaskRequestSchema), updateTask);
router.delete('/tasks/:task_id', requiresAuth, deleteTask);
router.post('/:task_id/review', TasksController.createReview, s.createReview);

export default router;
