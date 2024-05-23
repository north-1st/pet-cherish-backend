import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import { uploadImageResponseSchema } from '@schema/upload';

export const setUploadSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  uploadImage(registry);
};

const uploadImage = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    tags: ['Upload'],
    path: '/api/v1/upload/image',
    summary: '新增：圖片',
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['PROFILE', 'PET', 'SITTER'],
                },
                file: { type: 'string', format: 'binary' },
              },
              required: ['type', 'file'],
            },
            example: {
              type: 'PROFILE',
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Upload image successfully',
        content: {
          'application/json': {
            schema: uploadImageResponseSchema,
          },
        },
      },
    },
  });
};
