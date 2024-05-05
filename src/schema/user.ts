import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);

export const userResponseSchema = z.object({
  id: z.string(),
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

export type UserResponse = z.infer<typeof userResponseSchema>;
