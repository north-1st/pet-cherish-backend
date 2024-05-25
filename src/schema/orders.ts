import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OrderStatus, TaskStatus } from '@prisma/client';
import { paginationSchema } from '@schema/pagination';

extendZodWithOpenApi(z);

export const orderBodySchema = z.object({
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

export const ownerOrdersReturnSchema = z
  .object({
    data: z.array(
      z.object({
        id: z.string(),
        sitter_user_id: z.string(),
        pet_owner_user_id: z.string(),
        status: z.nativeEnum({
          ...TaskStatus,
          CANCELED: OrderStatus.CANCELED,
          INVALID: OrderStatus.INVALID,
        }),
        report_image_list: z.array(z.string()),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
        task_id: z.string(),
      })
    ),
    total: z.number(),
    total_page: z.number(),
    status: z.boolean(),
  })
  .openapi({
    example: {
      data: [
        {
          id: '95489faba8bcd77a22dedb86',
          sitter_user_id: '84489faba8bcd77a22dedb54',
          pet_owner_user_id: '96489faba8bcd77a22dedb53',
          status: OrderStatus.TRACKING,
          report_image_list: [],
          created_at: '2022-01-01T00:00:00Z',
          updated_at: '2022-01-02T00:00:00Z',
          task_id: '95489faba8bcd77a22dedbws',
        },
      ],
      total: 23,
      total_page: 3,
      status: true,
    },
  });

export type OrdersRequest = z.infer<typeof orderBodySchema>;
export type OrdersParams = z.infer<typeof orderParamSchema>;
export type SitterOrderParams = z.infer<typeof sitterOrderParamSchema>;
export type OwnerOrderParams = z.infer<typeof ownerOrderParamSchema>;
