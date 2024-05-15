import swaggerAutogen from 'swagger-autogen';

import { OrdersRequest, orderBodySchema } from '@schema/orders';

import { version } from '../package.json';

const doc = {
  info: {
    title: 'Pet Cherish API Docs',
    description: '寵物陪伴媒合平台',
    version,
  },
  host: 'localhost:5000',
  tags: [
    {
      name: 'Users',
    },
    {
      name: 'Pets',
    },
    {
      name: 'Tasks',
    },
    {
      name: 'Orders',
    },
  ],
  definitions: {
    CreateOrder: {
      user_id: '888',
      task_id: '999',
    },
    SuccessResult: {
      status: true,
      data: {
        sitter_user_id: '111',
        task_id: '333',
        pet_owner_user_id: '444',
        report_content: '',
        report_image_list: [],
      },
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./app.ts'];

swaggerAutogen(outputFile, routes, doc);
