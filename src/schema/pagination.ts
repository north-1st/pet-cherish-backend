import { z } from 'zod';

export const paginatioSchema = z.object({
  page: z.number().catch(1),
  offset: z.number().min(0).catch(0),
  limit: z.number().min(1).catch(10),
});

export type Pagination = z.infer<typeof paginatioSchema>;
