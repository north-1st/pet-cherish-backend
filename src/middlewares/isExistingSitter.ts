import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { UserBaseSchema } from '@schema/user';

const isExistingSitter = async (req: Request<UserBaseSchema>, _res: Response, next: NextFunction) => {
  const sitter = await prisma.sitter.findUnique({
    where: {
      id: req.params.user_id,
    },
  });

  if (!sitter) {
    throw createHttpError(404, 'Sitter not found');
  }

  next();
};

export default isExistingSitter;
