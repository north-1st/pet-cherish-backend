import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const orderBodySchema = z.object({
  user_id: z.string(),
  task_id: z.string(),
});
export const orderParamSchema = z.object({
  order_id: z.string(),
});

export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;

export const orderBodyJsonSchema = zodToJsonSchema(orderBodySchema, 'orderBodySchema');
export const orderParamJsonSchema = zodToJsonSchema(orderParamSchema, 'orderParamSchema');
