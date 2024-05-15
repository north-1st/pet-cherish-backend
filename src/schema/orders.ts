import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

import { OrderStatus } from '@prisma/client';

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

export type BaseRequest = z.infer<typeof baseSchema>;
export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;
export type SitterOrderParams = z.infer<typeof sitterOrderParamSchema>;

export const orderBodyJsonSchema = zodToJsonSchema(orderBodySchema, 'orderBodySchema');
export const orderParamJsonSchema = zodToJsonSchema(orderParamSchema, 'orderParamSchema');
