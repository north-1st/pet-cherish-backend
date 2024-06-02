import { ZodSchema, z } from 'zod';

export function createResponsePaginationDataSchema<T>(dataSchema: ZodSchema<T>) {
  return z.object({
    data: z.array(dataSchema),
    total: z.number(),
    total_page: z.number(),
    status: z.boolean(),
  });
}

export function createResponseDataSchema<T>(dataSchema: ZodSchema<T>) {
  return z.object({
    data: z.array(dataSchema),
    status: z.boolean(),
  });
}

export function createBaseResponseDataSchema(dataSchema: z.AnyZodObject) {
  return z.object({
    data: dataSchema,
    status: z.boolean(),
  });
}
