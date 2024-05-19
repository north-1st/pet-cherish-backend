import { z } from 'zod';

import { ServiceType, TaskPublic, TaskStatus } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';
import { paginationRequestSchema } from '@schema/pagination';

export const createTaskBodySchema = z.object({
  title: z.string(),
  public: z.enum([TaskPublic.OPEN, TaskPublic.CLOSED]),
  service_type: z.nativeEnum(ServiceType),
  city: z.string(),
  district: z.string(),
  unit_price: z.number(),
  detail: z.string(),
  accept_sitter_contact: z.boolean(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  pet_id: objectIdSchema,
});

export const createTaskRequestSchema = z.object({
  body: createTaskBodySchema,
});

export const getTasksByUserRequestSchema = z.object({
  query: paginationRequestSchema,
  params: z.object({
    user_id: objectIdSchema,
  }),
});

export const updateTaskBodySchema = createTaskBodySchema.partial().extend({
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  unit_price: z.number(),
});

export const updateTaskRequestSchema = z.object({
  params: z.object({
    task_id: objectIdSchema,
  }),
  body: updateTaskBodySchema,
});

export const deleteTaskRequestSchema = z.object({
  params: z.object({
    task_id: objectIdSchema,
  }),
});

export const taskResponseSchema = z.object({
  id: objectIdSchema,
  title: z.string(),
  public: z.nativeEnum(TaskPublic).default(TaskPublic.OPEN),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.NULL),
  service_type: z.nativeEnum(ServiceType),
  city: z.string(),
  district: z.string(),
  unit_price: z.number(),
  total: z.number(),
  detail: z.string(),
  accept_sitter_contact: z.boolean().default(false),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const reviewBodySchema = z.object({
  user_id: z.string(),
  rating: z.number().min(1).max(5).default(5),
  content: z.string(),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;

export type GetTasksByUserRequest = z.infer<typeof getTasksByUserRequestSchema>;

export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>;

export type TaskResponse = z.infer<typeof taskResponseSchema>;

export type ReviewRequest = z.infer<typeof reviewBodySchema>;
