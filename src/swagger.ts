import swaggerAutogen from 'swagger-autogen';

import { version } from '../package.json';

const doc = {
  info: {
    title: 'Pet Cherish API Docs',
    description: '寵物陪伴媒合平台',
    version,
  },
  host: 'localhost:5000',
};

const outputFile = './swagger.json';
const routes = ['src/routes/*/*.ts'];

swaggerAutogen()(outputFile, routes, doc);
