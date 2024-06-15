import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  commentResponseSchema,
  createCommentRequestSchema,
  deleteCommentRequestSchema,
  getCommentRepliesRequestSchema,
  getCommentsRequestSchema,
  updateCommentRequestSchema,
} from '@schema/comments';

export const setCommentsSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createComment(registry, bearerAuth);
  getComments(registry, bearerAuth);
  getCommentReplies(registry, bearerAuth);
  updateComment(registry, bearerAuth);
  deleteComment(registry, bearerAuth);
};

const createComment = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Comments'],
    path: '/api/v1/tasks/{task_id}/comments',
    summary: '新增：評論',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: createCommentRequestSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: createCommentRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create comment successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Task not found',
      },
    },
  });
};

const getComments = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Comments'],
    path: '/api/v1/tasks/{task_id}/comments',
    summary: '取得：評論列表',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: getCommentsRequestSchema.shape.params,
      query: getCommentsRequestSchema.shape.query,
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.object({
              comments: z.array(commentResponseSchema),
              endOfPaginationReached: z.boolean(),
            }),
          },
        },
      },
      404: {
        description: 'Comments not found',
      },
    },
  });
};

const getCommentReplies = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Comments'],
    path: '/api/v1/comments/{comment_id}/replies',
    summary: '取得：評論回覆列表',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: getCommentRepliesRequestSchema.shape.params,
      query: getCommentRepliesRequestSchema.shape.query,
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.object({
              comments: z.array(commentResponseSchema),
              endOfPaginationReached: z.boolean(),
            }),
          },
        },
      },
      404: {
        description: 'Comment replies not found',
      },
    },
  });
};

const updateComment = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Comments'],
    path: '/api/v1/comments/{comment_id}',
    summary: '更新：評論',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: updateCommentRequestSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updateCommentRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update comment successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Comment not found',
      },
    },
  });
};

const deleteComment = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'delete',
    tags: ['Comments'],
    path: '/api/v1/comments/{comment_id}',
    summary: '刪除：評論',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: deleteCommentRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Delete comment successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Comment not found',
      },
    },
  });
};
