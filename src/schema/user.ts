import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { Gender } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';

export const userLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

extendZodWithOpenApi(z);

export const userResponseSchema = z.object({
  id: objectIdSchema,
  email: z.string().optional(),
  real_name: z.string().optional(),
  phone: z.string().optional().nullable(),
  nickname: z.string().nullable().default(''),
  birthdate: z.date().nullable(),
  gender: z.nativeEnum(Gender).nullable(),
  self_introduction: z.string().nullable().default(''),
  avatar: z.string().nullable(),
  is_sitter: z.boolean().default(false),
  is_deleted: z.boolean().optional(),
  average_rating: z.number().nullable(),
  total_reviews: z.number().default(0),
});

export const userBaseSchema = z.object({
  user_id: z.string().openapi({
    description: '使用者編號',
    // example: '1234',
  }),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserBaseSchema = z.infer<typeof userBaseSchema>;
