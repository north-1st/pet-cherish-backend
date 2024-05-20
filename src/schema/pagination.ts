import { z } from 'zod';

export const paginationRequestSchema = z.object({
  page: z.string().default('1'),
  offset: z.string().default('0'),
  limit: z.string().default('10'),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .transform((page) => parseInt(page))
    .catch(1),
  offset: z
    .string()
    .transform((offset) => parseInt(offset))
    .catch(0),
  limit: z
    .string()
    .transform((limit) => parseInt(limit))
    .catch(10),
});

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
