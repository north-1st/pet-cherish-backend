import { z } from 'zod';

export const uploadImageRequestSchema = z.object({
  file: z.custom<Express.Multer.File>().optional(),
  body: z.object({
    type: z.enum(['PROFILE', 'PET', 'SITTER']),
  }),
});

export type UploadImageRequest = z.infer<typeof uploadImageRequestSchema>;
