import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { PetSize, ServiceType, TaskPublic, TaskStatus } from '@prisma/client';
import { createBaseResponseDataSchema } from '@schema';
import { objectIdSchema } from '@schema/objectId';
import { paginationRequestSchema } from '@schema/pagination';
import { petResponseSchema } from '@schema/pet';
import { urlSchema } from '@schema/upload';

extendZodWithOpenApi(z);

export const createTaskBodySchema = z
  .object({
    title: z.string(),
    public: z.enum([TaskPublic.OPEN, TaskPublic.CLOSED]),
    cover: z.string().url(),
    service_type: z.nativeEnum(ServiceType),
    city: z.string(),
    district: z.string(),
    unit_price: z.number(),
    description: z.string(),
    accept_sitter_contact: z.boolean(),
    start_at: z.string().datetime(),
    end_at: z.string().datetime(),
    pet_id: objectIdSchema,
  })
  .openapi({
    description: '建立任務',
    example: {
      title: '任務名稱',
      public: 'OPEN',
      cover: 'https://picsum.photos/200',
      service_type: 'WALKING',
      city: '臺北市',
      district: '中正區',
      unit_price: 200,
      description: '任務描述',
      accept_sitter_contact: true,
      start_at: '2022-01-01T00:00:00.000Z',
      end_at: '2022-01-01T03:00:00.000Z',
      pet_id: '66489faba8bcd77a22dedbe3',
    },
  });

export const createTaskRequestSchema = z.object({
  body: createTaskBodySchema,
});

export const getTaskByIdRequestSchema = z.object({
  params: z.object({
    task_id: objectIdSchema,
  }),
});

export const getTasksByUserRequestSchema = z.object({
  query: paginationRequestSchema,
  params: z.object({
    user_id: objectIdSchema,
  }),
});

export const getTasksByQueryRequestSchema = z
  .object({
    query: paginationRequestSchema.extend({
      service_city: z.string(),
      // .optional(),
      service_district_list: z
        .string()
        .transform((str) => str.split(','))
        .optional(),
      service_type_list: z
        .string()
        .transform((str) => str.split(','))
        .refine(
          (services) => services.every((service) => Object.values(ServiceType).includes(service as ServiceType)),
          {
            message: 'Invalid service type',
          }
        )
        .transform((services) => services.map((service) => service as ServiceType))
        .optional(),
      pet_size_list: z
        .string()
        .transform((str) => str.split(','))
        .refine((sizes) => sizes.every((size) => Object.values(PetSize).includes(size as PetSize)), {
          message: 'Invalid pet size',
        })
        .transform((sizes) => sizes.map((size) => size as PetSize))
        .optional(),
    }),
  })
  .openapi({
    example: {
      query: {
        page: '1',
        offset: '10',
        limit: '10',
        service_city: '臺北市',
        service_district_list: '中和區,板橋區',
        service_type_list: 'PHOTOGRAPHY,HEALTH_CARE,BATH,WALKING',
        pet_size_list: 'M,L',
      },
    },
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

export const taskResponseSchema = z
  .object({
    id: objectIdSchema,
    title: z.string(),
    public: z.nativeEnum(TaskPublic).default(TaskPublic.OPEN),
    status: z.nativeEnum(TaskStatus).default(TaskStatus.NULL),
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
  })
  .openapi({
    example: {
      id: '66489faba8bcd77a22dedbe3',
      title: '任務名稱',
      public: 'OPEN',
      status: 'NULL',
      cover: 'https://picsum.photos/200',
      service_type: 'WALKING',
      city: '臺北市',
      district: '中正區',
      unit_price: 200,
      total: 1,
      description: '任務描述',
      accept_sitter_contact: true,
      start_at: '2022-01-01T00:00:00.000Z',
      end_at: '2022-01-01T03:00:00.000Z',
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-01-01T00:00:00.000Z',
    },
  });

const taskByIdResponseDataSchema = z.object({
  id: objectIdSchema,
  title: z.string(),
  public: z.nativeEnum(TaskPublic).default(TaskPublic.OPEN),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.NULL),
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
  order_id: z.string().nullable().optional(),
  review_id: z.string().nullable().optional(),
  user: z.object({
    id: objectIdSchema,
    email: z.string(),
    real_name: z.string(),
    nickname: z.string().nullable().optional(),
    average_rating: z.number().default(0),
    total_reviews: z.number().default(0),
    avatar: z.string().nullable(),
  }),
  pet: petResponseSchema,
});

export const taskByIdResponseSchema = createBaseResponseDataSchema(taskByIdResponseDataSchema).openapi({
  description: '查詢：指定任務',
  example: {
    status: true,
    data: {
      id: '6658a7d754390e6a3ed4370d',
      title: '任務標題103',
      public: 'OPEN',
      status: 'PENDING',
      cover:
        'https://storage.googleapis.com/pet-cherish-dev.appspot.com/task/3af7e666-7a77-4c34-a764-fbdf8cef63dd.jpeg?GoogleAccessId=firebase-adminsdk-ldt7v%40pet-cherish-dev.iam.gserviceaccount.com&Expires=16730294400&Signature=CjOf4xZi5dBPHxF6ngdcrAtmIu1htxiVoAK7S%2BFpxuYrt8MUY1lLybUMSqhtWMqx39gwR4rpWDWjsaLqID0mdtj9EfJVtROxhdqzbCkfcEdtboYI2RTFE5%2BgWomhBJw0M36hgCuqVCzxh%2F260%2BIIXKwNQcde6RwLx4B4Jhkekkwp4yKqDPciwFJmpK3%2BNX5sp5BSf%2B9e22E9tqju3rg1uNulTQIN6Si1qBf3qAG4Puwcd6IJv6W7ki02VWFovwTYZHvCppgB57YSd4donrICNoJpmDDCnrbvz6UqaF%2Fa36sdzv8AysB7mNSYQsOunUH6Qz3KtWWu6dlPCJnAqRl7sA%3D%3D',
      service_type: 'BATH',
      city: '臺北市',
      district: '大同區',
      unit_price: 1500,
      total: 3000,
      description: '柴犬定期洗澡',
      accept_sitter_contact: false,
      start_at: '2024-06-01T12:52:17.708Z',
      end_at: '2024-06-01T13:52:17.708Z',
      created_at: '2024-05-30T16:22:47.700Z',
      updated_at: '2024-06-10T14:22:47.211Z',
      user_id: '6658a67f6676e47b02f23e8b',
      pet_id: '6658a7ba54390e6a3ed4370c',
      order_id: null,
      review_id: '665ace0f28dba2608ccfd257',
      user: {
        id: '6658a67f6676e47b02f23e8b',
        email: '103@mail.com',
        real_name: '103',
        nickname: null,
        avatar: null,
        average_rating: 4.7,
        total_reviews: 1,
        pet_list: [
          {
            id: '6658a7ba54390e6a3ed4370c',
            name: '寵物Lauch',
          },
        ],
      },
      pet: {
        id: '6658a7ba54390e6a3ed4370c',
        name: '寵物Lauch',
        breed: '法鬥',
        size: 'S',
        character_list: ['IRRITABLE', 'SMART'],
        has_microchipped: true,
        is_neutered: true,
        health_description: '法鬥健康描述',
        avatar_list: [
          'https://firebasestorage.googleapis.com/v0/b/pet-cherish-dev.appspot.com/o/sitter%2F1ffb99a5-373d-4519-ab85-75b6e74054e3.png?alt=media&token=b153feb4-51eb-4601-b0fc-2a4572efabe1',
        ],
        created_at: '2024-05-30T16:22:18.216Z',
        updated_at: '2024-05-30T16:22:18.216Z',
        owner_user_id: '6658a67f6676e47b02f23e8b',
      },
    },
  },
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;

export type GetTaskByIdRequest = z.infer<typeof getTaskByIdRequestSchema>;
export type GetTasksByUserRequest = z.infer<typeof getTasksByUserRequestSchema>;
export type GetTasksByQueryRequest = z.infer<typeof getTasksByQueryRequestSchema>;

export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>;

export type TaskResponse = z.infer<typeof taskResponseSchema>;
