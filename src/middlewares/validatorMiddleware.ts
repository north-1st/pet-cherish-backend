import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ZodError, z } from 'zod';

export const validateMiddleware =
  (schema: z.AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        next(createHttpError(400, `${issue.path.join('.')} - ${issue.message}`));
      } else {
        next(createHttpError(500, 'Internal Server Error'));
      }
    }
  };
