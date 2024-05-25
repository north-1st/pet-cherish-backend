import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const reviewParamSchema = z.object({
  task_id: z.string().openapi({
    description: '任務編號',
    // example: '7777',
  }),
});

export const reviewBodySchema = z
  .object({
    user_id: z.string(),
    rating: z.number().min(1).max(5).default(5),
    content: z.string(),
  })
  .openapi({
    example: {
      user_id: '54489faba8bcd77a22dedue8',
      rating: 5,
      content: '評價內容',
    },
  });

export const reviewResponseSchema = z
  .object({
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
  })
  .openapi({
    example: {
      id: '595489faba8bcd77a22dedu05',
      pet_owner_user_id: '54489faba8bcd77a22dedue8',
      pet_owner_rating: 5,
      pet_owner_content: '飼主寫的評價內容',
      pet_owner_created_at: '2022-01-01T00:00:00.000Z',
      sitter_user_id: '66489faba8bcd77a22dedu09',
      sitter_rating: 5,
      sitter_content: '保姆寫的評價內容',
      sitter_user_created_at: '2022-01-01T00:00:00.000Z',
      task_id: '86489faba8bcd77a22dedu97',
    },
  });

export type ReviewParam = z.infer<typeof reviewParamSchema>;
export type ReviewRequest = z.infer<typeof reviewBodySchema>;
