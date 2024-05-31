import { RequestHandler } from 'express';

export const getTasks: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '取得：任務資料'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/{換成對應的名字}'
      }
    }
  */
  next();
};
