import { z } from 'zod';

const bearerAuthSchema = z.object({
  name: z.string(),
  ref: z.object({
    $ref: z.string(),
  }),
});

export type BearerAuth = z.infer<typeof bearerAuthSchema>;
