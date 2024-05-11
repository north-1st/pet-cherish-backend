import { z } from 'zod';

export const petSizeSchema = z.enum(['S', 'M', 'L']);

export const petCharacter = z.enum([
  'IRRITABLE',
  'CUTE',
  'SMART',
  'FRIENDLY',
  'GREEDY',
  'NAUGHTY',
  'SNOOZE',
  'ENERGETIC',
]);

export const petRequestSchema = z.object({
  name: z.string(),
  breed: z.string(),
  size: petSizeSchema,
  character_list: z.array(petCharacter).min(1).max(3),
  has_microchipped: z.boolean(),
  is_neutered: z.boolean(),
  health_description: z.string(),
  avatar_list: z.array(z.string()).min(1).max(3),
});

export const createPetRequest = z.object({
  params: z.object({ user_id: z.string() }),
  body: petRequestSchema,
});

export const getPetRequest = z.object({
  params: z.object({ user_id: z.string() }),
});

export const updatePetRequest = z.object({
  params: z.object({ id: z.string() }),
  body: petRequestSchema.partial(),
});

export const petResponseSchema = petRequestSchema.extend({
  id: z.string(),
});

export type PetSize = z.infer<typeof petSizeSchema>;
export type PetCharacter = z.infer<typeof petCharacter>;
export type CreatePetRequest = z.infer<typeof createPetRequest>;
export type GetPetRequest = z.infer<typeof getPetRequest>;
export type UpdatePetRequest = z.infer<typeof updatePetRequest>;
export type PetResponse = z.infer<typeof petResponseSchema>;
