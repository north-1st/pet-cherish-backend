import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { orderBodySchema } from '@schema/orders';
import { userBaseSchema } from '@schema/user';

export const setOrdersSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createOrder(registry, bearerAuth);
  //   refuseSitter(registry, bearerAuth);
  //   acceptSitter(registry, bearerAuth);
  //   payForOrder(registry, bearerAuth);
  //   completeOrder(registry, bearerAuth);
  //   cancelOrder(registry, bearerAuth);
  //   getPetOwnerOrders(registry);
  //   getSitterOrders(registry);
};

const createOrder = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Orders'],
    path: '/api/v1/orders',
    security: [{ [bearerAuth.name]: [] }],
    summary: '新增：訂單',
    request: {
      body: {
        content: {
          'application/json': {
            schema: orderBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'The application has been submitted!',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Task is not found!',
      },
      409: {
        description: 'Order has been created!',
      },
    },
  });
};
