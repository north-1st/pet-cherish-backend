import * as fs from 'fs';

import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { setCommentsSwagger } from '@config/swaggers/comments';
import { setHomeSwagger } from '@config/swaggers/home';
import { setOrdersSwagger } from '@config/swaggers/orders';
import { setPetsSwagger } from '@config/swaggers/pets';
import { setReviewsSwagger } from '@config/swaggers/reviews';
import { setSittersSwagger } from '@config/swaggers/sitters';
import { setTasksSwagger } from '@config/swaggers/tasks';
import { setUploadSwagger } from '@config/swaggers/upload';
import { setUsersSwagger } from '@config/swaggers/users';
import env from '@env';

import { version } from '../package.json';

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

setUsersSwagger(registry, bearerAuth);
setSittersSwagger(registry, bearerAuth);
setPetsSwagger(registry, bearerAuth);
setTasksSwagger(registry, bearerAuth);
setUploadSwagger(registry, bearerAuth);
setOrdersSwagger(registry, bearerAuth);
setReviewsSwagger(registry, bearerAuth);
setCommentsSwagger(registry, bearerAuth);
setHomeSwagger(registry, bearerAuth);

const getOpenApiDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Pet Cherish API Docs',
      description: '寵物陪伴媒合平台',
      version,
    },
    servers: [
      { url: env.BACK_END_PROD_URL, description: 'Production server' },
      { url: 'https://pet-cherish-backend.zeabur.app', description: 'Zeabur server' },
      { url: env.BACK_END_DEV_URL, description: 'Development server' },
    ],
  });
};

const writeDocumentation = () => {
  const docs = getOpenApiDocumentation();

  fs.writeFileSync(`${__dirname}/swagger.json`, JSON.stringify(docs, null, 2), {
    encoding: 'utf-8',
  });
};

writeDocumentation();
