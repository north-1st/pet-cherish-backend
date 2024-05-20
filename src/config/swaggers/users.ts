import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { userLoginRequestSchema, userResponseSchema } from '@schema/user';

export const setUsersSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  login(registry);
};

export const login = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    tags: ['Users'],
    path: '/api/v1/users/login',
    summary: '登入',
    request: {
      body: {
        content: {
          'application/json': {
            schema: userLoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'login successd',
        content: {
          'application/json': {
            schema: userResponseSchema.extend({
              accessToken: z.string(),
            }),
          },
        },
      },
    },
  });
};
