import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import prisma from '@prisma';
import { OrdersParams } from '@schema/orders';
import { paginationSchema } from '@schema/pagination';
import {
  CreateTaskBody,
  GetTasksByUserRequest,
  ReviewRequest,
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

export const createReview = async (
  req: Request<OrdersParams, unknown, ReviewRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, rating, content } = req.body;

  const handleOwnerReview = async (task_id: string, sitter_user_id: string, req_body: ReviewRequest) => {
    const { user_id, rating, content } = req_body;

    try {
      await prisma.$transaction(async (prisma) => {
        // (1) 飼主撰寫評價：
        const newReview = await prisma.review.create({
          data: {
            task_id,
            pet_owner_user_id: user_id,
            pet_owner_rating: rating,
            pet_owner_content: content,
            sitter_user_id,
          },
        });

        // (2) Task 掛 review_id
        await prisma.task.update({
          where: {
            id: task_id,
          },
          data: {
            review_id: newReview.id,
          },
        });

        // 重新計算[保姆]所有評價平均分：
        const newAverageRating = await prisma.review.aggregate({
          where: {
            sitter_user_id,
          },
          _avg: {
            pet_owner_rating: true,
          },
        });
        // 取得[保姆]評價最新總計：
        const newTotalReviews = await prisma.sitter.count({
          where: {
            user_id: sitter_user_id,
          },
        });

        // (3) 更新[保姆] Sitter: average_rating, total_reviews
        await prisma.sitter.update({
          where: {
            user_id: sitter_user_id,
          },
          data: {
            average_rating: newAverageRating._avg.pet_owner_rating || 0,
            total_reviews: newTotalReviews,
          },
        });
      });
    } catch (error) {
      console.log('handleReviewByOwner error: ', error);
      throw error;
    }
  };

  const handleSitterReview = async (task_id: string, pet_owner_user_id: string, req_body: ReviewRequest) => {
    const { rating, content } = req_body;

    try {
      await prisma.$transaction(async (prisma) => {
        // (1) 保姆撰寫評價：
        await prisma.review.update({
          where: {
            task_id,
          },
          data: {
            sitter_rating: rating,
            sitter_content: content,
            sitter_user_created_at: new Date(),
          },
        });

        // 重新計算[飼主]所有評價平均分：
        const newAverageRating = await prisma.review.aggregate({
          where: {
            pet_owner_user_id,
          },
          _avg: {
            sitter_rating: true,
          },
        });

        // 取得[飼主]評價最新總計：
        const newTotalReviews = await prisma.user.count({
          where: {
            id: pet_owner_user_id,
          },
        });

        // (2) 更新[飼主] User: average_rating, total_reviews
        await prisma.user.update({
          where: {
            id: pet_owner_user_id,
          },
          data: {
            average_rating: newAverageRating._avg.sitter_rating || 0,
            total_reviews: newTotalReviews,
          },
        });
      });
    } catch (error) {
      console.log('handleSitterReview error: ', error);
      throw error;
    }
  };

  try {
    // 找到指定訂單
    const targetOrder = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
    });
    if (!targetOrder) {
      res.status(404).json({
        message: 'Order is not found!',
        status: false,
      });
      return;
    }

    if (targetOrder.pet_owner_user_id === user_id) {
      // 飼主寫評價
      handleOwnerReview(targetOrder.task_id, targetOrder.sitter_user_id, req.body);
    } else {
      // 保姆寫評價
      handleSitterReview(targetOrder.task_id, targetOrder.pet_owner_user_id, req.body);
    }

    res.status(201).json({
      message: 'Create Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request<OrdersParams, unknown, ReviewRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, rating, content } = req.body;

  try {
    // 找到指定訂單
    const targetOrder = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
    });
    if (!targetOrder) {
      res.status(404).json({
        message: 'Order is not found!',
        status: false,
      });
      return;
    }

    if (targetOrder.pet_owner_user_id === user_id) {
      // 飼主更新評價
      await prisma.review.update({
        where: {
          task_id: targetOrder.task_id,
        },
        data: {
          pet_owner_rating: rating,
          pet_owner_content: content,
        },
      });
    } else {
      // 保姆更新評價
      await prisma.review.update({
        where: {
          task_id: targetOrder.task_id,
        },
        data: {
          sitter_rating: rating,
          sitter_content: content,
        },
      });
    }

    res.status(200).json({
      message: 'Update Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
