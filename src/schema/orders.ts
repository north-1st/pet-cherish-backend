import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OrderStatus, TaskStatus } from '@prisma/client';
import { paginationSchema } from '@schema/pagination';
import { userBaseSchema } from '@schema/user';

extendZodWithOpenApi(z);

export const orderBodySchema = userBaseSchema.extend({
  task_id: z.string().openapi({
    description: '任務編號',
    // example: '7777',
  }),
});

export const orderParamSchema = z.object({
  order_id: z.string().openapi({
    description: '訂單編號',
    example: '665655',
  }),
});

export const sitterOrderParamSchema = paginationSchema.extend({
  status: z.nativeEnum(OrderStatus).openapi({
    description: '訂單狀態: 保姆視角',
    example: OrderStatus.TRACKING,
  }),
});
export const ownerOrderParamSchema = paginationSchema.extend({
  status: z
    .nativeEnum({
      ...TaskStatus,
      CANCELED: OrderStatus.CANCELED,
      INVALID: OrderStatus.INVALID,
    })
    .openapi({
      description: '訂單狀態: 飼主視角',
      example: TaskStatus.PENDING,
    }),
});

export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;
export type SitterOrderParams = z.infer<typeof sitterOrderParamSchema>;
export type OwnerOrderParams = z.infer<typeof ownerOrderParamSchema>;
