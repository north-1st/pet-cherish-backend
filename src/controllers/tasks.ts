import { RequestHandler } from 'express';

import prisma from '@prisma';

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const allTasks = await prisma.task.findMany({
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(allTasks);
  } catch (error) {
    next(error);
  }
};
