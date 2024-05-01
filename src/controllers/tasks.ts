import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../prisma";

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const allTasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(allTasks);
  } catch (error) {
    next(error);
  }
};
