import { NextFunction, Request, Response } from 'express';

import { BaseRequest, OrdersParams, OrdersRequest, OwnerOrderParams, SitterOrderParams } from '@schema/orders';

// Swagger
export const createOrder = async (
  _req: Request<unknown, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '建立訂單'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */

  /* 
    #swagger.responses[201] = {
      schema: {
        $ref: '#/definitions/SuccessResult'
      }
    }
  */

  /* 
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definitions/ServerErrorResult'
      }
    }
  */

  next();
};

export const refuseSitter = async (
  _req: Request<OrdersParams, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '訂單狀態更新：拒絕指定保母'
  */
  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */
  next();
};

export const acceptSitter = async (
  _req: Request<OrdersParams, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '訂單狀態更新：接受指定保母'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */
  next();
};

export const payForOrder = async (
  _req: Request<OrdersParams, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '訂單狀態更新：飼主付款'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */
  next();
};

export const completeOrder = async (
  _req: Request<OrdersParams, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '訂單狀態更新：任務完成'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */
  next();
};

export const cancelOrder = async (
  _req: Request<OrdersParams, unknown, OrdersRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '訂單狀態更新：取消訂單'
  */

  /* 
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/components/schemas/Orders'
      }
    }
  */
  next();
};

export const getPetOwnerOrders = async (
  _req: Request<OwnerOrderParams, unknown, BaseRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '查詢：所有訂單<飼主視角>'
  */
  next();
};

export const getSitterOrders = async (
  _req: Request<SitterOrderParams, unknown, BaseRequest>,
  _res: Response,
  next: NextFunction
) => {
  /*
    #swagger.tags = ['Orders']
    #swagger.summary = '查詢：所有訂單<保母視角>'
  */
  next();
};
