import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const urlSchema = z.union([z.string().url(), z.null()]);

export const uploadImageRequestSchema = z.object({
  file: z.custom<Express.Multer.File>().optional(),
  body: z.object({
    type: z.enum(['PROFILE', 'PET', 'TASK', 'SITTER']),
  }),
});
export const uploadImageResponseSchema = z.string().url().openapi({
  example:
    'https://storage.googleapis.com/pet-cherish-dev.appspot.com/profile/fb8cb0a5-142d-4f69-80d6-1698f921ae86.png?GoogleAccessId=firebase-adminsdk-ldt7v%40pet-cherish-dev.iam.gserviceaccount.com&Expires=16730323200&Signature=lV0PHXyI6MFZPFWMXkfm7QYzvv5ElA9fElj2DpUjpAl3%2BwULrINdR1rQZ3Y3J9MNQRmScaliUbcUTBR%2FBKNMgztBQiOvpxyTSVVSxqLdx4HJVF%2BsCPgeEoqQ2OZravLrlq7ldhVXPDXQgH6FMw2IODrjAPWE7NTZ6lfsKZ7dYWCHLakh3uA1p1AztZaFvIE8mCP6TunBT0XuBTx6ZiKAsrhUii9N6s8QltJOaMyR11ZRhqqi4cH4Tx0Q0LImi19HZK7ZI%2FrnMXJz%2B8PLy2unoiOjw2j6WMQ6ZKdX9mrqA%2BLRHkO%2BwkGrwwbZDcqA%2FEEYgVLrBM7OSEqmmYrawa%2BsfA%3D%3D',
});

export type Url = z.infer<typeof urlSchema>;
export type UploadImageRequest = z.infer<typeof uploadImageRequestSchema>;
