import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  checkoutRequestSchema,
  checkoutResponseSchema,
  completeRequestSchema,
  completeResponseSchema,
} from '@schema/payment';

export const setPaymentSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  checkout(registry, bearerAuth);
  complete(registry, bearerAuth);
};

const checkout = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Payment'],
    path: '/api/v1/payment/checkout',
    summary: '建立結帳會話',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: checkoutRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'checkout successful',
        content: {
          'application/json': {
            schema: checkoutResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
      },
      500: {
        description: 'Internal Server Error',
      },
    },
  });
};

const complete = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Payment'],
    path: '/api/v1/payment/complete',
    summary: '完成付款',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      query: completeRequestSchema.shape.query,
    },
    responses: {
      201: {
        description: 'Payment successful',
        content: {
          'application/json': {
            schema: completeResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
};
