import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  checkoutRequestSchema,
  checkoutResponseSchema,
  completeRequestSchema,
  completeResponseSchema,
} from '@schema/payment';

export const setPaymentSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Payment'],
    path: '/api/v1/payment/checkout',
    summary: 'Create a new checkout session',
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
        description: 'Checkout created successfully',
        content: {
          'application/json': {
            schema: checkoutResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });

  registry.registerPath({
    method: 'get',
    tags: ['Payment'],
    path: '/api/v1/payment/complete',
    summary: 'Complete the payment',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      query: completeRequestSchema.shape.query,
    },
    responses: {
      201: {
        description: 'Payment completed successfully',
        content: {
          'application/json': {
            schema: completeResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
};
