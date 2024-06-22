import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OrderStatus, ServiceType, TaskPublic, TaskStatus } from '@prisma/client';
import { createBaseResponseDataSchema, createResponsePaginationDataSchema } from '@schema';
import { objectIdSchema } from '@schema/objectId';
import { paginationRequestSchema, paginationSchema } from '@schema/pagination';
import { checkoutBodyRequestSchema } from '@schema/payment';
import { urlSchema } from '@schema/upload';
import { userResponseSchema } from '@schema/user';

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

export const orderByIdRequestSchema = z.object({
  params: orderParamSchema,
});

export const orderRequestSchema = z.object({
  params: orderParamSchema,
  body: orderBodySchema,
});

export const payforOrderRequestSchema = z.object({
  params: orderParamSchema,
  body: checkoutBodyRequestSchema,
});

export const payforOrderResponseSchema = z.object({
  status: z.boolean(),
  data: z.object({
    payment_url: z.string(),
  }),
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
  task_id: z.string().optional(),
  status: z
    .string()
    .transform((value) => value.split(',').map((item) => item.trim()))
    .refine(
      (statuses) => Array.isArray(statuses) && statuses.every((status) => Object.keys(OrderStatus).includes(status)),
      { message: 'Invalid status value' }
    )
    .openapi({
      description: '訂單狀態: 飼主視角',
      example: `${TaskStatus.PENDING},${OrderStatus.INVALID}`,
    }),
});

export const ownerOrdersPaginationSchema = paginationSchema.extend({
  task_id: z.string().optional(),
  status: z
    .string()
    .transform((value) => value.split(',').map((item) => item.trim()))
    .refine(
      (statuses) => Array.isArray(statuses) && statuses.every((status) => Object.keys(OrderStatus).includes(status)),
      { message: 'Invalid status value' }
    ),
});

export const ownerOrdersRequestSchema = z.object({
  query: ownerOrdersQuerySchema,
});

const ordersResponseDataSchema = z.object({
  id: z.string(),
  pet_owner_user_id: z.string(),
  status: z.nativeEnum(OrderStatus),
  note: z.string(),
  payment_at: z.string().nullable(),
  payment_id: z.string().nullable(),
  payment_url: z.string().nullable(),
  report_content: z.string(),
  report_image_list: z.array(z.string()),
  report_created_at: z.string().nullable(),
  report_updated_at: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  sitter_user: userResponseSchema.partial(),
  task: z.object({
    id: objectIdSchema,
    title: z.string(),
    public: z.nativeEnum(TaskPublic),
    status: z.nativeEnum(TaskStatus),
    cover: urlSchema,
    service_type: z.nativeEnum(ServiceType),
    city: z.string(),
    district: z.string(),
    unit_price: z.number(),
    total: z.number(),
    description: z.string(),
    accept_sitter_contact: z.boolean().default(false),
    start_at: z.string().datetime(),
    end_at: z.string().datetime(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    user_id: objectIdSchema,
    pet_id: objectIdSchema,
    order_id: objectIdSchema.nullable(),
    review_id: objectIdSchema,
  }),
});

const demoOrderData = {
  id: '666d861d89a8d92b89dec71f',
  pet_owner_user_id: '6658a67f6676e47b02f23e8b',
  status: OrderStatus.PENDING,
  note: '100保姆來接案！',
  payment_at: null,
  payment_id: null,
  payment_url: null,
  report_content: '',
  report_image_list: [],
  report_created_at: null,
  report_updated_at: null,
  created_at: '2024-06-15T12:16:29.744Z',
  updated_at: '2024-06-15T12:16:29.744Z',
  sitter_user: {
    id: '66571db5146b42a4acc541b6',
    email: '100@mail.com',
    real_name: '100',
    phone: null,
    nickname: null,
    birthdate: null,
    gender: null,
    self_introduction: null,
    avatar: null,
    is_sitter: true,
    is_deleted: false,
    average_rating: null,
    total_reviews: 0,
  },
  task: {
    id: '6658a7d754390e6a3ed4370d',
    title: '任務標題103咻咻改改O',
    public: TaskPublic.OPEN,
    status: TaskStatus.PENDING,
    cover:
      'https://storage.googleapis.com/pet-cherish-dev.appspot.com/task/3af7e666-7a77-4c34-a764-fbdf8cef63dd.jpeg?GoogleAccessId=firebase-adminsdk-ldt7v%40pet-cherish-dev.iam.gserviceaccount.com&Expires=16730294400&Signature=CjOf4xZi5dBPHxF6ngdcrAtmIu1htxiVoAK7S%2BFpxuYrt8MUY1lLybUMSqhtWMqx39gwR4rpWDWjsaLqID0mdtj9EfJVtROxhdqzbCkfcEdtboYI2RTFE5%2BgWomhBJw0M36hgCuqVCzxh%2F260%2BIIXKwNQcde6RwLx4B4Jhkekkwp4yKqDPciwFJmpK3%2BNX5sp5BSf%2B9e22E9tqju3rg1uNulTQIN6Si1qBf3qAG4Puwcd6IJv6W7ki02VWFovwTYZHvCppgB57YSd4donrICNoJpmDDCnrbvz6UqaF%2Fa36sdzv8AysB7mNSYQsOunUH6Qz3KtWWu6dlPCJnAqRl7sA%3D%3D',
    service_type: ServiceType.BATH,
    city: '臺北市',
    district: '大同區',
    unit_price: 1500,
    total: 3000,
    description: '柴犬定期洗澡',
    accept_sitter_contact: false,
    start_at: '2024-06-01T12:52:17.708Z',
    end_at: '2024-06-01T13:52:17.708Z',
    created_at: '2024-05-30T16:22:47.700Z',
    updated_at: '2024-06-17T14:51:59.975Z',
    user_id: '6658a67f6676e47b02f23e8b',
    pet_id: '6658a7ba54390e6a3ed4370c',
    order_id: null,
    review_id: '665ace0f28dba2608ccfd257',
  },
};

export const orderResponseSchema = createBaseResponseDataSchema(orderByIdRequestSchema).openapi({
  description: '查詢：指定訂單',
  example: {
    status: true,
    data: demoOrderData,
  },
});

export const ordersResponseSchema = createResponsePaginationDataSchema(ordersResponseDataSchema).openapi({
  description: '所有訂單',
  example: {
    data: [demoOrderData],
    total: 1,
    total_page: 1,
    status: true,
  },
});

export const reportBodyContentSchema = z.object({
  report_content: z.string(),
  report_image_list: z.array(z.string()),
});

export const reportBodySchema = z
  .object({
    body: reportBodyContentSchema,
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
export type OrderByIdRequest = z.infer<typeof orderByIdRequestSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type SitterOrdersRequest = z.infer<typeof sitterOrdersRequestSchema>;
export type OwnerOrdersRequest = z.infer<typeof ownerOrdersRequestSchema>;
export type ReportRequest = z.infer<typeof reportBodySchema>;
export type PayforOrderResponse = z.infer<typeof payforOrderResponseSchema>;
