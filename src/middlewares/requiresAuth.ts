import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';

import env from '../env';
import prisma from '../prisma';

const requiresAuth: RequestHandler = async (req, res, next) => {
  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt_token = authHeader.split(' ')[1];

    try {
      if (!jwt_token) throw new Error('Token is missing');

      const decoded = jwt.verify(jwt_token, env.JWT_ACCESS_SECRET) as JwtPayload;

      const userId = decoded.id!;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        omit: {
          password: true,
        },
      });

      if (!user) throw new Error('User not found');

      // 檢查 token 的發行時間是否在用戶最後一次修改密碼之前
      if (decoded.iat && decoded.iat < Math.floor(new Date(user.lastPasswordChange).getTime() / 1000)) {
        return next(createHttpError(401, 'Token is invalid'));
      }

      req.user = user;
      next();
    } catch (err) {
      next(createHttpError(401, 'User not authenticated'));
    }
  }
};

export default requiresAuth;
