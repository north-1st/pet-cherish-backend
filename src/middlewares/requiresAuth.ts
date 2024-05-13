import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../env";
import prisma from "../prisma";

const requiresAuth: RequestHandler = async (req, res, next) => {
  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(401);

  if (authHeader && authHeader.startsWith("Bearer")) {
    const jwt_token = authHeader.split(" ")[1];

    try {
      if (!jwt_token) throw new Error("Token is missing");

      const decoded: any = jwt.verify(jwt_token, env.JWT_ACCESS_SECRET);

      const userId = decoded.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        omit: {
          password: true,
        },
      });

      if (!user) throw new Error("User not found");

      req.user = user;
      next();
    } catch (err) {
      next(createHttpError(401, "User not authenticated"));
    }
  }
};

export default requiresAuth;
