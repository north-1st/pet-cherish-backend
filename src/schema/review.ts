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

export type ReviewParam = z.infer<typeof reviewParamSchema>;
export type ReviewRequest = z.infer<typeof reviewBodySchema>;
