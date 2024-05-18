import { z } from 'zod';

import { objectIdSchema } from '@schema/objectId';

export const taskPublicSchema = z.enum(['OPEN', 'CLOSED', 'IN_TRANSACTION', 'DELETED', 'COMPLETED']);

export const taskStatusSchema = z.enum(['NULL', 'PENDING', 'UN_PAID', 'TRACKING', 'COMPLETED']);

export const serviceTypeSchema = z.enum(['PHOTOGRAPHY', 'HEALTH_CARE', 'BATH', 'WALKING']);

export const taskResponseSchema = z.object({
  id: objectIdSchema,
  title: z.string(),
  public: taskPublicSchema.default('OPEN'),
  status: taskStatusSchema.default('NULL'),
  service_type: serviceTypeSchema,
  city: z.string(),
  district: z.string(),
  unit_price: z.number(),
  total: z.number(),
  detail: z.string(),
  accept_sitter_contact: z.boolean().default(false),
  start_at: z.string(),
  end_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const reviewBodySchema = z.object({
  user_id: z.string(),
  rating: z.number().min(1).max(5).default(5),
  content: z.string(),
});

export type TaskPublic = z.infer<typeof taskPublicSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type ReviewRequest = z.infer<typeof reviewBodySchema>;
