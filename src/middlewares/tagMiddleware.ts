import { NextFunction, Request, Response } from 'express';

export const petsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Pets']
  next();
};

export const usersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Users']
  next();
};

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Upload']
  next();
};

export const ordersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Orders']
  next();
};

export const tasksMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Tasks']
  next();
};
