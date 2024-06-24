import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { homeResponseSchema } from '@schema/home';

export const setHomeSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  getHomeInfo(registry, bearerAuth);
};

const getHomeInfo = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Home'],
    path: '/api/v1/home',
    summary: '取得: 首頁資訊',
    responses: {
      200: {
        description: 'Get homepage successfully',
        content: {
          'application/json': {
            schema: z.array(homeResponseSchema),
          },
        },
      },
      400: {
        description: 'Get homepage info failed',
      },
    },
  });
};
