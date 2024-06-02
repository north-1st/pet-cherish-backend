import { z } from 'zod';

import { PetSize, SitterStatus } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';
import { paginationSchema } from '@schema/pagination';

export const applySitterRequestSchema = z.object({
  body: z.object({
    certificate_number: z.string(),
    certificate_image: z.string().url(),
    police_check_image: z.string().url().optional(),
  }),
});

const sitterServiceRequestSchema = z.object({
  service_city: z.string(),
  service_district_list: z.array(z.string()).min(1),
  photography_price: z.number().nullable(),
  health_care_price: z.number().nullable(),
  bath_price: z.number().nullable(),
  walking_price: z.number().nullable(),
  service_size_list: z.array(z.nativeEnum(PetSize)).min(1).max(3),
  is_door_to_door: z.boolean().default(false),
  image_list: z.array(z.string().url()).min(1).max(3),
  service_description: z.string(),
});

export const updateSitterServiceRequestSchema = z.object({
  body: sitterServiceRequestSchema,
});

export const sitterRequestSchema = z.object({
  params: z.object({
    user_id: objectIdSchema,
  }),
});

export const sitterResponseSchema = z.object({
  user_id: objectIdSchema,
  has_certificate: z.boolean().default(false),
  has_police_check: z.boolean().default(false),
  photography_price: z.number().nullable(),
  health_care_price: z.number().nullable(),
  bath_price: z.number().nullable(),
  walking_price: z.number().nullable(),
  service_size_list: z.array(z.nativeEnum(PetSize)).min(1).max(3),
  is_door_to_door: z.boolean().default(false),
  image_list: z.array(z.string()).min(1).max(3),
  service_description: z.string(),
  average_rating: z.number().nullable(),
  total_reviews: z.number().default(0),
  status: z.nativeEnum(SitterStatus).default(SitterStatus.APPROVING),
});

export const sitterRequestQuerySchema = z.object({
  query: paginationSchema.extend({
    service_city: z.string().optional(), // oprional for debugging -> need to change to must.
    service_district_list: z.array(z.string()).min(1).optional(), // oprional for debugging -> need to change to must.
    service_type_list: z.array(z.string()).min(1).optional(), // oprional for debugging -> need to change to must.
    certificate_list: z.array(z.string()).optional(),
  }),
});

export type ApplySitterRequest = z.infer<typeof applySitterRequestSchema>;
export type UpdateSitterServiceRequest = z.infer<typeof updateSitterServiceRequestSchema>;
export type SitterRequest = z.infer<typeof sitterRequestSchema>;
export type SitterResponse = z.infer<typeof sitterResponseSchema>;
export type SitterRequestQuery = z.infer<typeof sitterRequestQuerySchema>;
