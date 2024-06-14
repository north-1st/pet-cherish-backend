import { z } from 'zod';

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  createTaskBodySchema,
  deleteTaskRequestSchema,
  getTaskByIdRequestSchema,
  getTasksByQueryRequestSchema,
  getTasksByUserRequestSchema,
  taskByIdResponseSchema,
  taskResponseSchema,
  updateTaskRequestSchema,
} from '@schema/task';

export const setTasksSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  getTaskById(registry);
  createTask(registry, bearerAuth);
  updateTask(registry, bearerAuth);
  deleteTask(registry, bearerAuth);
  getTasksByUser(registry, bearerAuth);
  getTasksByQuery(registry, bearerAuth);
};

const getTaskById = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    tags: ['Tasks'],
    path: '/api/v1/tasks/{task_id}',
    summary: '查詢：指定任務',
    request: {
      params: getTaskByIdRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: taskByIdResponseSchema,
          },
        },
      },
      400: {
        description: 'Get task failed',
      },
      404: {
        description: 'Task not found',
      },
    },
  });
};

const createTask = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'post',
    tags: ['Tasks'],
    path: '/api/v1/tasks',
    summary: '新增：任務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createTaskBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Create task successfully',
      },
      400: {
        description: 'End time must be after start time',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Pet not found',
      },
    },
  });
};

const updateTask = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Tasks'],
    path: '/api/v1/tasks/{task_id}',
    summary: '更新：任務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: updateTaskRequestSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updateTaskRequestSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Update task successfully',
      },
      400: {
        description: 'End time must be after start time',
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

const deleteTask = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'delete',
    tags: ['Tasks'],
    path: '/api/v1/tasks/{task_id}',
    summary: '刪除：任務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: deleteTaskRequestSchema.shape.params,
    },
    responses: {
      200: {
        description: 'Delete task successfully',
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

const getTasksByUser = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Tasks'],
    path: '/api/v1/users/{user_id}/tasks',
    summary: '取得：使用者任務',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: getTasksByUserRequestSchema.shape.params,
      query: getTasksByUserRequestSchema.shape.query,
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.array(taskResponseSchema),
          },
        },
      },
      404: {
        description: 'User not found',
      },
    },
  });
};

const getTasksByQuery = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Tasks'],
    path: '/api/v1/tasks',
    summary: '查詢：任務',
    request: {
      query: getTasksByQueryRequestSchema.shape.query,
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.array(taskResponseSchema),
          },
        },
      },
      400: {
        description: 'Get tasks failed',
      },
    },
  });
};
