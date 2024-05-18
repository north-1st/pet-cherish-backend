import { NextFunction, Request, RequestHandler, Response } from 'express';

import prisma from '@prisma';
import { OrdersParams } from '@schema/orders';
import { ReviewRequest } from '@schema/task';

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

export const createReview = async (
  req: Request<OrdersParams, unknown, ReviewRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { order_id } = req.params;
    const { user_id, rating, content } = req.body;

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

    const targetTask = await prisma.task.findUnique({
      where: {
        id: targetOrder.task_id,
      },
    });

    if (!targetTask) {
      res.status(404).json({
        message: 'Task is not found!',
        status: false,
      });
      return;
    }

    if (targetTask.user_id === user_id) {
      // 飼主撰寫評價：
      const newReview = await prisma.review.create({
        data: {
          task_id: targetTask.id,
          pet_owner_user_id: user_id,
          pet_owner_rating: rating,
          pet_owner_content: content,
          sitter_user_id: targetOrder.sitter_user_id,
        },
      });

      // Task 掛 review_id
      await prisma.task.update({
        where: {
          id: targetTask.id,
        },
        data: {
          review_id: newReview.id,
        },
      });
    } else {
      // 保姆撰寫評價：
      await prisma.review.update({
        where: {
          task_id: targetTask.id,
        },
        data: {
          sitter_rating: rating,
          sitter_content: content,
          sitter_user_created_at: new Date(),
        },
      });
    }

    res.status(201).json({
      message: 'Create Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};
