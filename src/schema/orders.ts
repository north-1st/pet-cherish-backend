import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OrderStatus, TaskStatus } from '@prisma/client';
import { createResponsePaginationDataSchema } from '@schema';
import { paginationRequestSchema, paginationSchema } from '@schema/pagination';

extendZodWithOpenApi(z);

export const orderBodySchema = z.object({
  task_id: z.string().openapi({
    description: '任務編號',
    example: '6658a7d754390e6a3ed4370d',
  }),
});

export const orderParamSchema = z.object({
  order_id: z.string().openapi({
    description: '訂單編號',
    example: '6658a256a8b5660a69d5e0d9',
  }),
});
export const orderRequestSchema = z.object({
  params: orderParamSchema,
  body: orderBodySchema,
});

export const createOrderBodySchema = z
  .object({
    task_id: z.string(),
    note: z.string(),
  })
  .openapi({
    description: '新增訂單：我要接案',
    example: {
      task_id: '6658a7d754390e6a3ed4370d',
      note: '我是保姆100，想接法鬥案子！',
    },
  });
export const createOrderRequestSchema = z.object({
  body: createOrderBodySchema,
});

export const sitterOrdersQuerySchema = paginationRequestSchema.extend({
  status: z.nativeEnum(OrderStatus).openapi({
    description: '訂單狀態: 保姆視角',
    example: OrderStatus.TRACKING,
  }),
});
export const sitterOrdersPaginationSchema = paginationSchema.extend({
  status: z.nativeEnum(OrderStatus),
});
export const sitterOrdersRequestSchema = z.object({
  query: sitterOrdersQuerySchema,
});

export const ownerOrdersQuerySchema = paginationRequestSchema.extend({
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
export const ownerOrdersPaginationSchema = paginationSchema.extend({
  status: z.nativeEnum({
    ...TaskStatus,
    CANCELED: OrderStatus.CANCELED,
    INVALID: OrderStatus.INVALID,
  }),
});
export const ownerOrdersRequestSchema = z.object({
  query: ownerOrdersQuerySchema,
});

const ordersResponseDataSchema = z.object({
  id: z.string(),
  sitter_user_id: z.string(),
  pet_owner_user_id: z.string(),
  status: z.nativeEnum(OrderStatus),
  note: z.string(),
  third_party_id: z.string().nullable(),
  payment_at: z.string().nullable(),
  report_content: z.string(),
  report_image_list: z.array(z.string()),
  report_created_at: z.string().nullable(),
  report_updated_at: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  task_id: z.string(),
});
export const ordersResponseSchema = createResponsePaginationDataSchema(ordersResponseDataSchema).openapi({
  description: '所有訂單',
  example: {
    data: [
      {
        id: '6658a84a54390e6a3ed4370e',
        sitter_user_id: '66571db5146b42a4acc541b6',
        pet_owner_user_id: '6658a67f6676e47b02f23e8b',
        status: 'PENDING',
        note: '我是保姆100，想接法鬥案子！',
        third_party_id: null,
        payment_at: null,
        report_content: '',
        report_image_list: [],
        report_created_at: null,
        report_updated_at: null,
        created_at: '2024-05-30T16:24:42.444Z',
        updated_at: '2024-05-30T16:24:42.444Z',
        task_id: '6658a7d754390e6a3ed4370d',
      },
      {
        id: '6658a256a8b5660a69d5e0d9',
        sitter_user_id: '66571db5146b42a4acc541b6',
        pet_owner_user_id: '66571fc0146b42a4acc541b7',
        status: 'PENDING',
        note: '我是保姆100，想接案！',
        third_party_id: null,
        payment_at: null,
        report_content: '',
        report_image_list: [],
        report_created_at: null,
        report_updated_at: null,
        created_at: '2024-05-30T15:59:18.340Z',
        updated_at: '2024-05-30T15:59:18.340Z',
        task_id: '66573506bb73e558b2e52c43',
      },
    ],
    total: 2,
    total_page: 1,
    status: true,
  },
});

export const reportBodySchema = z
  .object({
    body: z.object({
      report_content: z.string(),
      report_image_list: z.array(z.string()),
    }),
  })
  .openapi({
    description: '報告',
    example: {
      body: {
        report_content: '報告內容',
        report_image_list: ['url_to_photo1.jpg", "url_to_photo2.jpg'],
      },
    },
  });

export type OrdersRequest = z.infer<typeof orderRequestSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type SitterOrdersRequest = z.infer<typeof sitterOrdersRequestSchema>;
export type OwnerOrdersRequest = z.infer<typeof ownerOrdersRequestSchema>;
export type ReportRequest = z.infer<typeof reportBodySchema>;
