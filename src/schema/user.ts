import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { objectIdSchema } from '@schema/objectId';

extendZodWithOpenApi(z);

export const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);

export const userResponseSchema = z.object({
  id: objectIdSchema,
  email: z.string().optional(),
  real_name: z.string().optional(),
  phone: z.string().optional(),
  nickname: z.string().default(''),
  birthdate: z.date().nullable(),
  gender: genderSchema.nullable(),
  self_introduction: z.string().default(''),
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
