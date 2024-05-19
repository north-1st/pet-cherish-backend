import { z } from 'zod';

import { PetCharacter, PetSize } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';

export const petRequestSchema = z.object({
  name: z.string(),
  breed: z.string(),
  size: z.nativeEnum(PetSize),
  character_list: z.array(z.nativeEnum(PetCharacter)).min(1).max(3),
  has_microchipped: z.boolean(),
  is_neutered: z.boolean(),
  health_description: z.string(),
  avatar_list: z.array(z.string().url()).min(1).max(3),
});

export const createPetRequestSchema = z.object({
  params: z.object({ user_id: objectIdSchema }),
  body: petRequestSchema,
});

export const getPetRequestSchema = z.object({
  params: z.object({ user_id: objectIdSchema }),
});

export const updatePetRequestSchema = z.object({
  params: z.object({ pet_id: objectIdSchema }),
  body: petRequestSchema.partial(),
});

export const petResponseSchema = petRequestSchema.extend({
  id: objectIdSchema,
});

export type CreatePetRequest = z.infer<typeof createPetRequestSchema>;
export type GetPetRequest = z.infer<typeof getPetRequestSchema>;
export type UpdatePetRequest = z.infer<typeof updatePetRequestSchema>;
export type PetResponse = z.infer<typeof petResponseSchema>;
