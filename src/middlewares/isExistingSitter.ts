import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { UserBaseSchema } from '@schema/user';

const isExistingSitter = async (req: Request<UserBaseSchema>, _res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
        user: {
          is_sitter: true,
        },
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isExistingSitter;
