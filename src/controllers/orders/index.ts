import { NextFunction, Request, Response } from 'express';

import prisma from '@prisma';

import { CreateOrdersRequest } from '../../types/orders';

export const createOrder = async (req: CreateOrdersRequest, res: Response, next: NextFunction) => {
  const { task_id, user_id } = req.body;
  if (!task_id || !user_id) {
    res.status(400).json({
      message: 'Bad Request!',
      status: false,
    });
    return;
  }

  try {
    const existingLiveTaskOrders = await prisma.order.findMany({
      where: {
        AND: [{ task_id }, { status: { notIn: ['CANCELED', 'INVALID'] } }],
      },
    });
    if (existingLiveTaskOrders.length > 0) {
      res.status(409).json({
        message: 'Order has been created!',
        status: false,
      });
      return;
    }

    const targetTask = await prisma.task.findUnique({
      where: {
        id: task_id,
      },
    });
    if (targetTask === null) {
      res.status(404).json({
        message: 'Task not found!',
        status: false,
      });
      return;
    }

    const data = {
      sitter_user_id: user_id,
      task_id,
      pet_owner_user_id: targetTask.user_id,
      report_content: '',
      report_image_list: [],
    };
    const newOrder = await prisma.order.create({ data });
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

export const updateOrdersByRefuseSitter = async (_: Request, res: Response, next: NextFunction) => {};

export const updateOrdersByAcceptSitter = async (_: Request, res: Response, next: NextFunction) => {};

export const updateOrdersByPaid = async (_: Request, res: Response, next: NextFunction) => {};

export const updateOrdersByComplete = async (_: Request, res: Response, next: NextFunction) => {};

export const updateOrdersByCancel = async (_: Request, res: Response, next: NextFunction) => {};

export const getPetOwnerOrders = async (req: Request, res: Response, next: NextFunction) => {};

export const getSitterOrders = async (req: Request, res: Response, next: NextFunction) => {};
