import { z } from 'zod';

import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OrderStatus, TaskStatus } from '@prisma/client';
import { paginatioSchema } from '@schema/pagination';

extendZodWithOpenApi(z);

export const baseSchema = z.object({
  user_id: z.string().openapi({
    description: '使用者編號',
    // example: '1234',
  }),
});
export const orderBodySchema = baseSchema.extend({
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

export const sitterOrderParamSchema = paginatioSchema.extend({
  status: z.nativeEnum(OrderStatus).openapi({
    description: '訂單狀態: 保姆視角',
    example: OrderStatus.TRACKING,
  }),
});
export const ownerOrderParamSchema = paginatioSchema.extend({
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

export type BaseRequest = z.infer<typeof baseSchema>;
export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;
export type SitterOrderParams = z.infer<typeof sitterOrderParamSchema>;
export type OwnerOrderParams = z.infer<typeof ownerOrderParamSchema>;

const registry = new OpenAPIRegistry();
export const orderType = registry.register('Orders', orderBodySchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openAPIComponents = generator.generateComponents();
console.log('🚀 ~ openAPIComponents:', openAPIComponents);
