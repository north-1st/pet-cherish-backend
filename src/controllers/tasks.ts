import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { PetSize, ServiceType } from '@prisma/client';
import { paginationSchema } from '@schema/pagination';
import {
  CreateTaskBody,
  GetTasksByQueryRequest,
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

    if (req.body.end_at < req.body.start_at) {
      throw createHttpError(400, 'End time must be after start time');
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

    if (req.body.end_at < req.body.start_at) {
      throw createHttpError(400, 'End time must be after start time');
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

export const getTasksByQuery = async (req: GetTasksByQueryRequest, res: Response, next: NextFunction) => {
  try {
    const service_district_list = req.query.service_district_list
      ? Array.isArray(req.query.service_district_list)
        ? (req.query.service_district_list as string[])[0].split(',')
        : [req.query.service_district_list]
      : [];
    const service_type_list = req.query.service_type_list
      ? Array.isArray(req.query.service_type_list)
        ? (req.query.service_type_list as string[])[0].split(',').map((type) => type.toUpperCase())
        : [req.query.service_type_list]
      : [];
    const pet_size_list = req.query.pet_size_list
      ? Array.isArray(req.query.pet_size_list)
        ? (req.query.pet_size_list as string[])[0].split(',').map((size) => size.toUpperCase())
        : [req.query.pet_size_list]
      : [];

    const { page, limit, offset } = paginationSchema.parse(req.query);

    if (service_district_list.length === 0 || service_type_list.length === 0 || pet_size_list.length === 0) {
      res.status(400).json({
        status: false,
        message: 'service_district_list, service_type_list and pet_size_list must contain at least one element',
      });
      return;
    }

    const queryParams = {
      where: {
        city: req.query.service_city,
        district: {
          in: service_district_list,
        },
        service_type: {
          in: service_type_list as ServiceType[],
        },
        pet: {
          size: {
            in: pet_size_list as PetSize[],
          },
        },
      },
    };

    console.log('Prisma Query:', queryParams);
    const [tasks, count] = await prisma.$transaction([
      prisma.task.findMany({
        ...queryParams,
        take: limit,
        skip: (page - 1) * limit + offset,
        orderBy: {
          created_at: 'desc',
        },
        // include: {
        //   pet: true, // 這樣可以在查詢結果中包含 Pet 的信息
        // },
      }),
      prisma.task.count({ ...queryParams }),
    ]);

    res.status(200).json({
      status: true,
      data: {
        tasks_list: tasks,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          has_next_page: page < Math.ceil(count / limit),
          has_prev_page: page > 1,
        },
        total: count,
        message: 'Get tasks successfully',
      },
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
