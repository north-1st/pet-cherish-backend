import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { reviewBodySchema, reviewParamSchema, reviewResponseSchema } from '@schema/review';

export const setReviewsSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createReview(registry, bearerAuth);
  updateReview(registry, bearerAuth);
  getReviewByTaskId(registry, bearerAuth);
  //   getTasksByUser(registry, bearerAuth);
};

const commonReviewSetting = (bearerAuth: BearerAuth) => ({
  tags: ['Reviews'],
  path: '/api/v1/tasks/{task_id}/review',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: reviewParamSchema,
    body: {
      content: {
        'application/json': {
          schema: reviewBodySchema,
        },
      },
    },
  },
  responses: {
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

const createReview = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  const { tags, path, security, request, responses } = commonReviewSetting(bearerAuth);
  registry.registerPath({
    tags,
    path,
    security,
    request,
    method: 'post',
    summary: '新增：飼主/保姆 評價',
    responses: {
      201: {
        description: 'Create Successfully!',
      },
      ...responses,
    },
  });
};

const updateReview = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  const { tags, path, security, request, responses } = commonReviewSetting(bearerAuth);

  registry.registerPath({
    tags,
    path,
    security,
    request,
    method: 'patch',
    summary: '編輯：飼主/保姆 評價',
    responses: {
      200: {
        description: 'Update Successfully!',
      },
      ...responses,
    },
  });
};

const getReviewByTaskId = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  const { tags, path, security, request } = commonReviewSetting(bearerAuth);

  registry.registerPath({
    tags,
    path,
    security,
    request: {
      params: request.params,
    },
    method: 'get',
    summary: '查詢：其中一訂單，飼主/保姆 評價',
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: reviewResponseSchema,
          },
        },
      },
      404: {
        description: 'Review is not found!',
      },
    },
  });
};
