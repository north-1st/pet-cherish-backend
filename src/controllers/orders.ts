import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import { OrderStatus, TaskPublic, TaskStatus } from '@prisma/client';
import {
  createOrderRequestSchema,
  orderBodySchema,
  orderParamSchema,
  ownerOrdersPaginationSchema,
  sitterOrdersPaginationSchema,
} from '@schema/orders';

import prisma from '../prisma';

export const createOrder = async (_req: Request, res: Response, next: NextFunction) => {
  const req = createOrderRequestSchema.parse(_req);
  const { task_id, note } = req.body;
  if (!_req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    const existingLiveTaskOrders = await prisma.order.findMany({
      where: {
        AND: [
          {
            task_id,
          },
          {
            pet_owner_user_id: _req.user.id,
          },
          {
            status: {
              notIn: [OrderStatus.CANCELED, OrderStatus.INVALID],
            },
          },
        ],
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
        message: 'Task is not found!',
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
      sitter_user_id: _req.user.id,
      task_id,
      pet_owner_user_id: targetTask.user_id,
      note: note || '',
      report_content: '',
      report_image_list: [],
    };
    await prisma.order.create({ data });
    res.status(201).json({
      message: 'The application has been submitted!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const refuseSitter = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id } = orderBodySchema.parse(req.body);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

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
        pet_owner_user_id: req.user.id,
        status: OrderStatus.PENDING,
      },
    });

    if (pendingOrders.length === 0) {
      await prisma.task.update({
        where: {
          id: task_id,
          user_id: req.user.id,
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

export const acceptSitter = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id } = orderBodySchema.parse(req.body);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

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
        user_id: req.user.id,
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

export const payForOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id } = orderBodySchema.parse(req.body);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

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
        user_id: req.user.id,
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

export const completeOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id } = orderBodySchema.parse(req.body);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

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
        user_id: req.user.id,
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

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id } = orderBodySchema.parse(req.body);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

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
        id: task_id,
        order_id,
      },
      data: {
        order_id: null,
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

export const getPetOwnerOrders = async (_req: Request, res: Response, next: NextFunction) => {
  const { limit, page, status } = ownerOrdersPaginationSchema.parse(_req.query);
  if (!_req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    if (status === OrderStatus.CANCELED || status === OrderStatus.INVALID) {
      const conditions = {
        pet_owner_user_id: _req.user.id,
        status,
      };
      const getData = prisma.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: conditions,
        orderBy: {
          updated_at: 'desc',
        },
      });
      const getTotal = prisma.order.count({
        where: conditions,
      });

      const [data, total] = await Promise.all([getData, getTotal]);
      res.status(200).json({
        data,
        total,
        total_page: Math.ceil(total / limit),
        status: true,
      });
    } else {
      const conditions = {
        user_id: _req.user.id,
        status,
      };
      const getData = prisma.task.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: conditions,
        orderBy: {
          updated_at: 'desc',
        },
        include: {
          order: true,
        },
      });
      const getTotal = prisma.task.count({
        where: conditions,
      });

      const [data, total] = await Promise.all([getData, getTotal]);
      res.status(200).json({
        data: data[0].order,
        total,
        total_page: Math.ceil(total / limit),
        status: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getSitterOrders = async (_req: Request, res: Response, next: NextFunction) => {
  const { limit, page, status } = sitterOrdersPaginationSchema.parse(_req.query);
  if (!_req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    const conditions = {
      sitter_user_id: _req.user.id,
      status,
    };
    const getData = prisma.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: conditions,
      orderBy: {
        updated_at: 'desc',
      },
    });
    const getTotal = prisma.order.count({
      where: conditions,
    });
    const [data, total] = await Promise.all([getData, getTotal]);

    res.status(200).json({
      data,
      total,
      total_page: Math.ceil(total / limit),
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
  let report_created_time: string | null = null;
  let report_updated_time: string | null = null;
  const { order_id } = req.params;
  const { report_content, report_image_list } = req.body;
  const is_input_report_body_empty = report_content === '' && report_image_list.length === 0; // To check if all input contents are not filled.

  if (!order_id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    const current_report = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
      select: {
        report_content: true,
        report_created_at: true,
      },
    });

    if (!current_report) {
      res.status(400).json({
        message: 'No matched order found!',
        status: false,
      });
    } else {
      const now = formatDateToUTCPlusOffset(new Date(), 0); // datetime concert to UTC+0
      // const now = (new Date()).toISOString();
      if (!current_report.report_created_at) {
        if (!is_input_report_body_empty) {
          report_created_time = report_updated_time = now;
        }
      } else {
        report_created_time = current_report.report_created_at.toISOString();
        report_updated_time = now;
      }
    }

    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        report_content,
        report_image_list,
        report_created_at: report_created_time,
        report_updated_at: report_updated_time,
      },
    });

    res.status(200).json({
      message: 'Update report successfully!',
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportByOrderId = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.params;

  if (!order_id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    const data = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
      select: {
        report_content: true,
        report_image_list: true,
        report_created_at: true,
        report_updated_at: true,
        task_id: true,
        task: {
          select: {
            title: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    res.status(200).json({
      data,
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

function formatDateToUTCPlusOffset(currentTime: Date, offset: number) {
  const utcDate = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
  const utcPlus8Date = new Date(utcDate.getTime() + offset * 3600000);

  const year = utcPlus8Date.getFullYear();
  const month = String(utcPlus8Date.getMonth() + 1).padStart(2, '0');
  const day = String(utcPlus8Date.getDate()).padStart(2, '0');
  const hours = String(utcPlus8Date.getHours()).padStart(2, '0');
  const minutes = String(utcPlus8Date.getMinutes()).padStart(2, '0');
  const seconds = String(utcPlus8Date.getSeconds()).padStart(2, '0');
  const milliseconds = String(utcPlus8Date.getMilliseconds()).padStart(3, '0');

  // '2024-05-30T6:24:42.444Z' to UTC+8 => "2024-05-30T14:24:42.444Z"
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}
