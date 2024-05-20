import { NextFunction, Response } from 'express';

import { CreatePetRequest, GetPetRequest, UpdatePetRequest } from '@schema/pet';

// Swagger
export const createPet = async (_req: CreatePetRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Pets']
    #swagger.summary = '新增：寵物資料'
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

export const getPets = async (_req: GetPetRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Pets']
    #swagger.summary = '取得：寵物資料'
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

export const updatePet = async (_req: UpdatePetRequest, _res: Response, next: NextFunction) => {
  /*
    #swagger.tags = ['Pets']
    #swagger.summary = '更新：寵物資料'
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
