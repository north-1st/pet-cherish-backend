import { RequestHandler } from 'express';

export const getAuthenticatedUser: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '取得：使用者的ＯＯ'
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

export const getUser: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '取得：使用者資料'
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

export const signUp: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '註冊'
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

export const logIn: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '登入'
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

export const logOut: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '登出'
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

export const updateUser: RequestHandler = async (_req, _res, next) => {
  /*
    #swagger.tags = ['Users']
    #swagger.summary = '更新：使用者資料'
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
