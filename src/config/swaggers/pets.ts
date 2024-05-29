import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  createPetRequestSchema,
  getPetsByUserRequestSchema,
  petResponseSchema,
  updatePetRequestSchema,
} from '@schema/pet';

export const setPetsSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createPet(registry, bearerAuth);
  updatePet(registry, bearerAuth);
  getPetsByUser(registry);
};

const createPet = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Pets'],
    path: '/api/v1/pets',
    summary: '新增：寵物',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createPetRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create pet successfully',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
};

const updatePet = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Pets'],
    path: '/api/v1/pets/{pet_id}',
    summary: '更新：寵物',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: updatePetRequestSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updatePetRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update pet successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Pet not found',
      },
    },
  });
};

const getPetsByUser = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    tags: ['Pets'],
    path: '/api/v1/users/{user_id}/pets',
    summary: '取得：使用者寵物',
    request: {
      params: getPetsByUserRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Get pets successfully',
        content: {
          'application/json': {
            schema: z.array(petResponseSchema),
          },
        },
      },
    },
  });
};
