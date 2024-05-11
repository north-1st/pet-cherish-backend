import { z } from 'zod';

import { petSizeSchema } from '@schema/pet';
import { serviceTypeSchema } from '@schema/task';

export const sitterStatusSchema = z.enum(['APPROVING', 'REJECTED', 'APPROVED', 'PENDING']);

export const sitterResponseSchema = z.object({
  user_id: z.string(),
  has_certificate: z.boolean().default(false),
  has_police_check: z.boolean().default(false),
  photography_price: z.number().nullable(),
  health_care_price: z.number().nullable(),
  bath_price: z.number().nullable(),
  walking_price: z.number().nullable(),
  service_size_list: z.array(petSizeSchema).min(1).max(3),
  is_door_to_door: z.boolean().default(false),
  image_list: z.array(z.string()).min(1).max(3),
  service_description: z.string(),
  average_rating: z.number().nullable(),
  total_reviews: z.number().default(0),
  service_type_list: z.array(serviceTypeSchema).min(1).max(4),
  status: sitterStatusSchema.default('PENDING'),
});

export type SitterStatus = z.infer<typeof sitterStatusSchema>;
export type SitterResponse = z.infer<typeof sitterResponseSchema>;
