import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  applySitterRequestSchema,
  sitterRequestQuerySchema,
  sitterRequestSchema,
  sitterResponseSchema,
  updateSitterServiceRequestSchema,
} from '@schema/sitter';

export const setSittersSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  applySitter(registry, bearerAuth);
  updateSitterApplication(registry, bearerAuth);
  updateSitterService(registry, bearerAuth);
  getSitterService(registry, bearerAuth);
  sitterApprove(registry, bearerAuth);
  sitterReject(registry, bearerAuth);
  getSitterServiceList(registry, bearerAuth);
};

const applySitter = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Sitters'],
    path: '/api/v1/apply-sitter',
    summary: '申請保姆',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: applySitterRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Apply sitter successfully',
      },
      400: {
        description: 'Already apply sitter',
      },
      401: {
        description: 'Unauthorized',
      },
    },
  });
};

const updateSitterApplication = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Sitters'],
    path: '/api/v1/apply-sitter',
    summary: '更新：保姆申請',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: applySitterRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update sitter application successfully',
      },
      201: {
        description: 'Apply sitter successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      404: {
        description: 'Sitter not found',
      },
    },
  });
};

const updateSitterService = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Sitters'],
    path: '/api/v1/sitters',
    summary: '更新：保姆服務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: updateSitterServiceRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update sitter service successfully',
      },
      400: {
        description: 'Please provide at least one service',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Sitter is not approved',
      },
      404: {
        description: 'You are not a sitter',
      },
    },
  });
};

const getSitterService = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Sitters'],
    path: '/api/v1/sitters/{user_id}',
    summary: '取得：保姆服務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: sitterRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Update task successfully',
        content: {
          'application/json': {
            schema: sitterResponseSchema,
          },
        },
      },
      403: {
        description: 'Sitter is not approved',
      },
      404: {
        description: 'Sitter not found',
      },
    },
  });
};

const sitterApprove = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Sitters'],
    path: '/api/v1/sitters/{user_id}/approve',
    summary: '審核保姆：核可',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: sitterRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Approve sitter successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Sitter not found',
      },
    },
  });
};

const sitterReject = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Sitters'],
    path: '/api/v1/sitters/{user_id}/reject',
    summary: '審核保姆：不核可',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: sitterRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Reject sitter successfully',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Sitter not found',
      },
    },
  });
};

const getSitterServiceList = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Sitters'],
    path: '/api/v1/sitters',
    summary: '查詢: 保母',
    request: {
      query: sitterRequestQuerySchema.shape.query,
    },
    responses: {
      200: {
        description: 'Get sitters successfully',
        content: {
          'application/json': {
            schema: z.array(sitterResponseSchema),
          },
        },
      },
      400: {
        description: 'Get sitters failed',
      },
    },
  });
};
