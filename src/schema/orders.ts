import { type } from 'os';
import { z } from 'zod';

import { OrderStatus, TaskStatus } from '@prisma/client';

export const baseSchema = z.object({
  user_id: z.string(),
});
export const orderBodySchema = baseSchema.extend({
  task_id: z.string(),
});
export const orderParamSchema = z.object({
  order_id: z.string(),
});
export const sitterOrderParamSchema = z.object({
  limit: z.number(),
  page: z.number(),
  status: z.nativeEnum(OrderStatus),
});
export const ownerOrderParamSchema = z.object({
  limit: z.number(),
  page: z.number(),
  status: z.nativeEnum({ ...TaskStatus, CANCELED: OrderStatus.CANCELED, INVALID: OrderStatus.INVALID }),
});

export type BaseRequest = z.infer<typeof baseSchema>;
export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;
export type SitterOrderParams = z.infer<typeof sitterOrderParamSchema>;
export type OwnerOrderParams = z.infer<typeof ownerOrderParamSchema>;
