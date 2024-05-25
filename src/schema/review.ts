import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const reviewParamSchema = z.object({
  task_id: z.string().openapi({
    description: '任務編號',
    // example: '7777',
  }),
});

export const reviewBodySchema = z.object({
  user_id: z.string().openapi({ description: '使用者編號' }),
  rating: z.number().min(1).max(5).default(5).openapi({ description: '評價幾顆星' }),
  content: z.string().openapi({ description: '評價內容' }),
});
export type ReviewParam = z.infer<typeof reviewParamSchema>;
export type ReviewRequest = z.infer<typeof reviewBodySchema>;
