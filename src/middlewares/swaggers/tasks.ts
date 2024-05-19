import { NextFunction, Request, RequestHandler, Response } from 'express';

import { OrdersParams } from '@schema/orders';
import { ReviewRequest } from '@schema/task';

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

export const createReview = async (
  _req: Request<OrdersParams, unknown, ReviewRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '新增：評價'
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

export const updateReview = async (
  _req: Request<OrdersParams, unknown, ReviewRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '更新：評價'
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
