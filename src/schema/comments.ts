import { z } from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { objectIdSchema } from '@schema/objectId';

extendZodWithOpenApi(z);

export const createCommentBodySchema = z
  .object({
    text: z.string(),
    parent_comment_id: objectIdSchema.optional(),
  })
  .openapi({
    description: '建立評論',
    example: {
      text: 'This is a sample comment',
      parent_comment_id: '60d21b4667d0d8992e610c86',
    },
  });

export const createCommentRequestSchema = z.object({
  params: z
    .object({
      task_id: objectIdSchema,
    })
    .openapi({
      example: {
        task_id: '60d21b4667d0d8992e610c85',
      },
    }),
  body: createCommentBodySchema,
});

export const getCommentsRequestSchema = z.object({
  params: z
    .object({
      task_id: objectIdSchema,
    })
    .openapi({
      example: {
        task_id: '60d21b4667d0d8992e610c85',
      },
    }),
  query: z
    .object({
      continueAfterId: objectIdSchema.optional(),
      pageSize: z.string().optional().default('3'),
    })
    .openapi({
      example: {
        continueAfterId: '60d21b4667d0d8992e610c87',
        pageSize: '3',
      },
    }),
});

export const getCommentRepliesRequestSchema = z.object({
  params: z
    .object({
      comment_id: objectIdSchema,
    })
    .openapi({
      example: {
        comment_id: '60d21b4667d0d8992e610c86',
      },
    }),
  query: z
    .object({
      continueAfterId: objectIdSchema.optional(),
      pageSize: z.string().optional().default('3'),
    })
    .openapi({
      example: {
        continueAfterId: '60d21b4667d0d8992e610c87',
        pageSize: '3',
      },
    }),
});

export const updateCommentBodySchema = z
  .object({
    text: z.string(),
  })
  .openapi({
    description: '更新評論',
    example: {
      text: 'This is an updated comment',
    },
  });

export const updateCommentRequestSchema = z.object({
  params: z
    .object({
      comment_id: objectIdSchema,
    })
    .openapi({
      example: {
        comment_id: '60d21b4667d0d8992e610c86',
      },
    }),
  body: updateCommentBodySchema,
});

export const deleteCommentRequestSchema = z.object({
  params: z
    .object({
      comment_id: objectIdSchema,
    })
    .openapi({
      example: {
        comment_id: '60d21b4667d0d8992e610c86',
      },
    }),
});

export const commentResponseSchema = z
  .object({
    id: objectIdSchema,
    parent_comment_id: objectIdSchema.optional(),
    text: z.string(),
    author_id: objectIdSchema,
    task_id: objectIdSchema,
    created_at: z.string().datetime(),
    author: z.object({
      id: objectIdSchema,
      real_name: z.string(),
      avatar: z.string().optional(),
      nickname: z.string().optional(),
    }),
  })
  .openapi({
    example: {
      id: '60d21b4667d0d8992e610c86',
      parent_comment_id: '60d21b4667d0d8992e610c87',
      text: 'This is a sample comment',
      author_id: '60d21b4667d0d8992e610c85',
      task_id: '60d21b4667d0d8992e610c84',
      created_at: '2022-01-01T00:00:00.000Z',
      author: {
        id: '60d21b4667d0d8992e610c85',
        real_name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        nickname: 'Johnny',
      },
    },
  });

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;

export type GetCommentsRequest = z.infer<typeof getCommentsRequestSchema>;

export type UpdateCommentBody = z.infer<typeof updateCommentBodySchema>;
export type UpdateCommentRequest = z.infer<typeof updateCommentRequestSchema>;

export type DeleteCommentRequest = z.infer<typeof deleteCommentRequestSchema>;

export type CommentResponse = z.infer<typeof commentResponseSchema>;
