import { z } from 'zod';

import { Gender } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';

export const userLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userResponseSchema = z.object({
  id: objectIdSchema,
  email: z.string().optional(),
  real_name: z.string().optional(),
  phone: z.string().optional(),
  nickname: z.string().default(''),
  birthdate: z.date().nullable(),
  gender: z.nativeEnum(Gender).nullable(),
  self_introduction: z.string().default(''),
  avatar: z.string().nullable(),
  is_sitter: z.boolean().default(false),
  is_deleted: z.boolean().optional(),
  average_rating: z.number().nullable(),
  total_reviews: z.number().default(0),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
