import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { objectIdSchema } from '@schema/objectId';
import { reviewResponseDataSchema } from '@schema/review';
import { sitterResponseSchema } from '@schema/sitter';

extendZodWithOpenApi(z);

export const homeResponseSchema = z.object({
  suggestion_sitter_list: z.array(sitterResponseSchema).optional(),
  sitter_reviews_list: z.array(reviewResponseDataSchema).optional(),
  easily_and_quickly_match: z
    .object({
      total_sitters: z.number(),
      total_users: z.number(),
      complete_task_hours: z.number(),
    })
    .optional(),
});

export type HomeResponse = z.infer<typeof homeResponseSchema>;
