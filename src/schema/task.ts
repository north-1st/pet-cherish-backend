import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { PetSize, ServiceType, TaskPublic, TaskStatus } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';
import { paginationRequestSchema } from '@schema/pagination';
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
      service_city: z.string().optional(),
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

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;

export type GetTaskByIdRequest = z.infer<typeof getTaskByIdRequestSchema>;
export type GetTasksByUserRequest = z.infer<typeof getTasksByUserRequestSchema>;
export type GetTasksByQueryRequest = z.infer<typeof getTasksByQueryRequestSchema>;

export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>;

export type TaskResponse = z.infer<typeof taskResponseSchema>;
