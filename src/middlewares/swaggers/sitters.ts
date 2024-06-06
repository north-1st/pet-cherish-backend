import { NextFunction, Response } from 'express';

import { ApplySitterRequest, SitterRequest, UpdateSitterServiceRequest } from '@schema/sitter';

// Swagger
export const applySitter = async (_req: ApplySitterRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Sitters']
    #swagger.summary = '申請保姆'
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

export const sitterApprove = async (_req: SitterRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Sitters']
    #swagger.summary = '審核保姆：核可'
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

export const sitterReject = async (_req: SitterRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Sitters']
    #swagger.summary = '審核保姆：不核可'
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

export const getSitterService = async (_req: SitterRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Sitters']
    #swagger.summary = '取得：保姆服務'
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

export const updateSitterService = async (_req: UpdateSitterServiceRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Sitters']
    #swagger.summary = '更新：保姆服務'
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
