import { z } from 'zod';

import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import { BearerAuth } from '@schema/bearerAuth';
import {
  orderBodySchema,
  orderParamSchema,
  ordersResponseSchema,
  reportBodyContentSchema,
  reportBodySchema,
} from '@schema/orders';
import { userBaseSchema } from '@schema/user';

export const setOrdersSwagger = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  createOrder(registry, bearerAuth);
  refuseSitter(registry, bearerAuth);
  acceptSitter(registry, bearerAuth);
  payForOrder(registry, bearerAuth);
  completeOrder(registry, bearerAuth);
  cancelOrder(registry, bearerAuth);
  getPetOwnerOrders(registry, bearerAuth);
  getSitterOrders(registry, bearerAuth);
  updateReport(registry, bearerAuth);
  getReportByOrderId(registry, bearerAuth);
};

const commonUpdateOrderSetting = (bearerAuth: BearerAuth): RouteConfig => ({
  method: 'patch',
  tags: ['Orders'],
  path: '',
  security: [{ [bearerAuth.name]: [] }],
  summary: '',
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
    200: {
      description: 'Update Successfully!',
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

const commonGetOrderSetting = (bearerAuth: BearerAuth): RouteConfig => ({
  method: 'get',
  tags: ['Orders'],
  path: '',
  security: [{ [bearerAuth.name]: [] }],
  summary: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userBaseSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: ordersResponseSchema,
        },
      },
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
            schema: {
              report_content: '報告內容',
              report_image_list: ['url_to_photo1.jpg", "url_to_photo2.jpg'],
            },
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

const refuseSitter = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonUpdateOrderSetting(bearerAuth),
    path: '/api/v1/orders/{order_id}/refuse-sitter',
    summary: '更新：訂單狀態 / 拒絕指定保母',
  });
};

const acceptSitter = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonUpdateOrderSetting(bearerAuth),
    path: '/api/v1/orders/{order_id}/accept-sitter',
    summary: '更新：訂單狀態 / 接受指定保母',
  });
};

const payForOrder = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonUpdateOrderSetting(bearerAuth),
    path: '/api/v1/orders/{order_id}/paid',
    summary: '更新：訂單狀態 / 飼主付款',
  });
};

const completeOrder = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonUpdateOrderSetting(bearerAuth),
    path: '/api/v1/orders/{order_id}/complete',
    summary: '更新：訂單狀態 / 任務完成',
  });
};

const cancelOrder = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonUpdateOrderSetting(bearerAuth),
    path: '/api/v1/orders/{order_id}/cancel',
    summary: '更新：訂單狀態 / 取消訂單',
  });
};

const getPetOwnerOrders = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonGetOrderSetting(bearerAuth),
    path: '/api/v1/orders/pet-owner',
    summary: '查詢：所有訂單<飼主視角>',
  });
};

const getSitterOrders = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    ...commonGetOrderSetting(bearerAuth),
    path: '/api/v1/orders/sitter',
    summary: '查詢：所有訂單<保姆視角>',
  });
};

const getReportByOrderId = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'get',
    tags: ['Report'],
    path: '/api/v1/orders/{order_id}/report',
    security: [{ [bearerAuth.name]: [] }],
    summary: '取得: 任務報告',
    parameters: [
      {
        name: 'order_id',
        in: 'path',
        required: true,
        schema: { type: 'string', example: '6659fd29fdf9b075e2a9362c' },
        description: '訂單ID',
      },
    ],
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: ordersResponseSchema,
          },
        },
      },
      404: {
        description: 'Order is not found!',
      },
    },
  });
};

const updateReport = (registry: OpenAPIRegistry, bearerAuth: BearerAuth) => {
  registry.registerPath({
    method: 'patch',
    tags: ['Report'],
    path: '/api/v1/orders/{order_id}/report',
    security: [{ [bearerAuth.name]: [] }],
    summary: '更新: 任務報告',
    parameters: [
      {
        name: 'order_id',
        in: 'path',
        required: true,
        schema: { type: 'string', example: '6659fd29fdf9b075e2a9362c' },
        description: '訂單ID',
      },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: reportBodyContentSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: ordersResponseSchema,
          },
        },
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
