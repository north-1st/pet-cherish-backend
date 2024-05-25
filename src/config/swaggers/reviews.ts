import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { reviewBodySchema } from '@schema/review';

export const setReviewsSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createReview(registry, bearerAuth);
  //   updateTask(registry, bearerAuth);
  //   deleteTask(registry, bearerAuth);
  //   getTasksByUser(registry, bearerAuth);
};

const createReview = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Reviews'],
    path: '/api/v1/tasks/:task_id/review',
    summary: '新增：評價',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: reviewBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create review successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Order is not found!',
      },
    },
  });
};
