import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { paginationSchema } from '@schema/pagination';
import {
  CreateTaskBody,
  GetTasksByUserRequest,
  UpdateTaskBody,
  createTaskRequestSchema,
  deleteTaskRequestSchema,
  updateTaskRequestSchema,
} from '@schema/task';

export const createTask = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = createTaskRequestSchema.parse(_req);
    const { pet_id } = req.body;

    const pet = await prisma.pet.findUnique({
      where: {
        id: pet_id,
      },
    });

    if (!pet) {
      throw createHttpError(404, 'Pet not found');
    }

    if (pet.owner_user_id !== _req.user!.id) {
      throw createHttpError(403, 'Forbidden');
    }

    await prisma.task.create({
      data: {
        user_id: _req.user!.id,
        ...req.body,
        total: calculateTotal(req.body),
      },
    });

    res.status(201).json({
      status: true,
      message: 'Create task successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = updateTaskRequestSchema.parse(_req);

    const task = await prisma.task.findUnique({
      where: {
        id: req.params.task_id,
      },
      select: {
        user_id: true,
      },
    });

    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    if (task.user_id != _req.user?.id) {
      throw createHttpError(403, 'Forbidden');
    }

    await prisma.task.update({
      where: {
        id: req.params.task_id,
      },
      data: {
        ...req.body,
        total: calculateTotal(req.body),
      },
    });

    res.status(200).json({
      status: true,
      message: 'Update task successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const req = deleteTaskRequestSchema.parse(_req);

    const task = await prisma.task.findUnique({
      where: {
        id: req.params.task_id,
      },
      select: {
        user_id: true,
      },
    });

    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    if (task.user_id != _req.user?.id) {
      throw createHttpError(403, 'Forbidden');
    }

    await prisma.task.delete({
      where: {
        id: _req.params.task_id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Delete task successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByUser = async (req: GetTasksByUserRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.user_id,
      },
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const { page, limit, offset } = paginationSchema.parse(req.query);

    const filter = {
      where: {
        user_id: req.params.user_id,
      },
    };

    const [tasks, count] = await prisma.$transaction([
      prisma.task.findMany({
        ...filter,
        take: limit,
        skip: (page - 1) * limit + offset,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.task.count(filter),
    ]);

    res.status(200).json({
      status: true,
      message: 'Get tasks successfully',
      total: count,
      data: tasks,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const calculateTotal = (task: CreateTaskBody | UpdateTaskBody) => {
  const unit = (Date.parse(task.end_at.toString()) - Date.parse(task.start_at.toString())) / 1000 / 60 / 30;
  return unit * task.unit_price;
};
