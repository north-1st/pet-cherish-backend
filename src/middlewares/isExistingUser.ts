import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { UserBaseSchema } from '@schema/user';

const isExistingUser = async (req: Request<UserBaseSchema>, _res: Response, next: NextFunction) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.user_id,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  next();
};

export default isExistingUser;
