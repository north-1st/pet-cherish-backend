import { NextFunction, Request, Response } from 'express';

import { OrderStatus, TaskPublic, TaskStatus } from '@prisma/client';
import { OrdersParams, OrdersRequest } from '@schema/orders';

import prisma from '../prisma';

export const createOrder = async (req: Request<unknown, unknown, OrdersRequest>, res: Response, next: NextFunction) => {
  const { user_id, task_id } = req.body;

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

    // 訂單狀態<飼主視角>：待處理
    await prisma.task.update({
      where: {
        id: task_id,
      },
      data: {
        status: TaskStatus.PENDING,
      },
    });

    // 訂單狀態<保姆視角>：待處理
    const data = {
      sitter_user_id: user_id,
      task_id,
      pet_owner_user_id: targetTask.user_id,
      report_content: '',
      report_image_list: [],
    };
    const newOrder = await prisma.order.create({ data });
    res.status(201).json({
      data: newOrder,
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrdersByRefuseSitter = async (
  req: Request<OrdersParams, unknown, OrdersRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // 訂單狀態<保姆視角>：未成立
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: OrderStatus.INVALID,
      },
    });

    // 飼主任務：若所有接單申請需求都拒絕，修改 Task.status
    const pendingOrders = await prisma.order.findMany({
      where: {
        task_id,
        pet_owner_user_id: user_id,
        status: OrderStatus.PENDING,
      },
    });

    if (pendingOrders.length === 0) {
      await prisma.task.update({
        where: {
          id: task_id,
          user_id,
        },
        data: {
          status: TaskStatus.NULL,
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

export const updateOrdersByAcceptSitter = async (
  req: Request<OrdersParams, unknown, OrdersRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // 訂單狀態<保姆視角>：已成立
    const targetOrder = await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: OrderStatus.VALID,
      },
    });

    // 訂單狀態<飼主視角>：待付款
    await prisma.task.update({
      where: {
        id: task_id,
        user_id,
      },
      data: {
        order_id,
        status: TaskStatus.UN_PAID,
      },
    });

    // 拒絕其他提交申請的保姆
    const pendingOrders = await prisma.order.findMany({
      where: {
        task_id,
        sitter_user_id: targetOrder.sitter_user_id,
        status: OrderStatus.PENDING,
      },
    });

    if (pendingOrders.length > 0) {
      await prisma.order.updateMany({
        where: {
          task_id,
          status: OrderStatus.PENDING,
        },
        data: {
          status: OrderStatus.INVALID,
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

export const updateOrdersByPaid = async (
  req: Request<OrdersParams, unknown, OrdersRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // 訂單狀態<保姆視角>：任務進度追蹤
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: OrderStatus.TRACKING,
      },
    });

    // 訂單狀態<飼主視角>：任務進度追蹤
    await prisma.task.update({
      where: {
        user_id,
        order_id,
      },
      data: {
        status: TaskStatus.TRACKING,
        public: TaskPublic.IN_TRANSACTION,
      },
    });

    res.status(200).json({
      message: 'Update Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrdersByComplete = async (
  req: Request<OrdersParams, unknown, OrdersRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // 訂單狀態<保姆視角>：已完成
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: OrderStatus.COMPLETED,
      },
    });

    // 訂單狀態<飼主視角>：已完成
    await prisma.task.update({
      where: {
        user_id,
        order_id,
      },
      data: {
        status: TaskStatus.COMPLETED,
        public: TaskPublic.COMPLETED,
      },
    });

    // （補）7天到直接改狀態：後端排程

    res.status(200).json({
      message: 'Update Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrdersByCancel = async (
  req: Request<OrdersParams, unknown, OrdersRequest>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params;
  const { user_id, task_id } = req.body;

  try {
    // 訂單狀態<保姆視角>：已取消
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: OrderStatus.CANCELED,
      },
    });

    // 訂單狀態<飼主視角>：已取消
    await prisma.task.update({
      where: {
        order_id,
      },
      data: {
        order_id: undefined,
        status: TaskStatus.NULL,
        public: TaskPublic.OPEN,
      },
    });

    res.status(200).json({
      message: 'Update Successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetOwnerOrders = async (req: Request, res: Response, next: NextFunction) => {};

export const getSitterOrders = async (req: Request, res: Response, next: NextFunction) => {};
