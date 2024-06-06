import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { createBaseResponseDataSchema, createResponseDataSchema, createResponsePaginationDataSchema } from '@schema';

extendZodWithOpenApi(z);

export const reviewParamSchema = z.object({
  task_id: z.string().openapi({
    description: '任務編號',
    example: '66573506bb73e558b2e52c43',
  }),
});

export const reviewBodySchema = z
  .object({
    order_id: z.string(),
    rating: z.number().min(1).max(5).default(5),
    content: z.string(),
  })
  .openapi({
    example: {
      order_id: '6659fd29fdf9b075e2a9362c',
      rating: 5,
      content: '評價內容',
    },
  });

export const reviewRequestSchema = z.object({
  params: reviewParamSchema,
  body: reviewBodySchema,
});

export const getReviewRequestSchema = z.object({
  params: reviewParamSchema,
});

export const reviewResponseDataSchema = z.object({
  id: z.string(),
  pet_owner_user_id: z.string(),
  pet_owner_rating: z.number().min(1).max(5).default(5),
  pet_owner_content: z.string(),
  pet_owner_created_at: z.string(),
  sitter_user_id: z.string(),
  sitter_rating: z.number().min(1).max(5).default(5),
  sitter_content: z.string(),
  sitter_user_created_at: z.string(),
  task_id: z.string(),
});

export const reviewResponseSchema = createBaseResponseDataSchema(reviewResponseDataSchema).openapi({
  description: '指定評價資料',
  example: {
    data: {
      id: '665ace0f28dba2608ccfd257',
      pet_owner_user_id: '6658a67f6676e47b02f23e8b',
      pet_owner_rating: 3,
      pet_owner_content: '修改飼主評價內容',
      pet_owner_created_at: '2024-06-01T07:30:23.475Z',
      sitter_user_id: '6659fb917bce00ca07bcdd14',
      sitter_rating: 5,
      sitter_content: '保姆評價內容',
      sitter_user_created_at: '2024-06-01T07:52:02.712Z',
      task_id: '6658a7d754390e6a3ed4370d',
    },
    status: true,
  },
});

export const reviewsResponseSchema = createResponseDataSchema(reviewResponseDataSchema).openapi({
  description: '指定評價資料',
  example: {
    data: [
      {
        id: '665ace0f28dba2608ccfd257',
        pet_owner_user_id: '6658a67f6676e47b02f23e8b',
        pet_owner_rating: 3,
        pet_owner_content: '修改飼主評價內容',
        pet_owner_created_at: '2024-06-01T07:30:23.475Z',
        sitter_user_id: '6659fb917bce00ca07bcdd14',
        sitter_rating: 5,
        sitter_content: '保姆評價內容',
        sitter_user_created_at: '2024-06-01T07:52:02.712Z',
        task_id: '6658a7d754390e6a3ed4370d',
      },
    ],
    status: true,
  },
});

export type ReviewParam = z.infer<typeof reviewParamSchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
export type GetReviewRequest = z.infer<typeof getReviewRequestSchema>;
