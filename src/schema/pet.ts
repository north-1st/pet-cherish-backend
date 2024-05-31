import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { PetCharacter, PetSize } from '@prisma/client';
import { objectIdSchema } from '@schema/objectId';

extendZodWithOpenApi(z);

export const petRequestSchema = z.object({
  name: z.string().openapi({ example: '寵物名稱' }),
  breed: z.string().openapi({ example: '寵物品種' }),
  size: z.nativeEnum(PetSize).openapi({ example: PetSize.S }),
  character_list: z
    .array(z.nativeEnum(PetCharacter))
    .min(1)
    .max(3)
    .openapi({ example: [PetCharacter.CUTE, PetCharacter.ENERGETIC] }),
  has_microchipped: z.boolean().openapi({ example: false }),
  is_neutered: z.boolean().openapi({ example: false }),
  health_description: z.string().openapi({ example: '健康狀況描述' }),
  avatar_list: z
    .array(z.string().url())
    .min(1)
    .max(3)
    .openapi({ example: ['https://picsum.photos/200'] }),
});

export const createPetRequestSchema = z.object({
  body: petRequestSchema,
});

export const getPetsByUserRequestSchema = z.object({
  params: z.object({ user_id: objectIdSchema }),
});

export const updatePetRequestSchema = z.object({
  params: z.object({ pet_id: objectIdSchema }),
  body: petRequestSchema.partial(),
});

export const petResponseSchema = petRequestSchema.extend({
  id: objectIdSchema.openapi({ example: '6649d4e467b627a60555c5fd' }),
});

export type CreatePetRequest = z.infer<typeof createPetRequestSchema>;
export type GetPetsByUserRequest = z.infer<typeof getPetsByUserRequestSchema>;
export type UpdatePetRequest = z.infer<typeof updatePetRequestSchema>;
export type PetResponse = z.infer<typeof petResponseSchema>;
