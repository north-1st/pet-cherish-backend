import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { UserBaseSchema } from '@schema/user';
import getPayloadFromToken from '@service/getPayloadFromToken';

const isExistingSitter = async (req: Request<UserBaseSchema>, _res: Response, next: NextFunction) => {
  try {
    const sitter = await prisma.sitter.findUnique({
      where: {
        user_id: req.params.user_id,
      },
      include: {
        user: true,
      },
    });

    if (!sitter) {
      throw createHttpError(404, 'Sitter not found');
    }

    const { id: user_id } = getPayloadFromToken(req);

    if (!sitter.user.is_sitter && user_id != req.params.user_id) {
      throw createHttpError(403, 'Sitter is not approved');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isExistingSitter;
