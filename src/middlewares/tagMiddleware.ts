import { NextFunction, Request, Response } from 'express';

export const usersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Users']
  next();
};

export const sitterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Sitters']
  next();
};

export const tasksMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Tasks']
  next();
};
