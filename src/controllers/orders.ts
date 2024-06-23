import axios, { AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { ObjectId } from 'mongodb';

import env from '@env';
import agenda from '@job';
import { ORDER_STATUS_JOB } from '@job/orderCompletedJob';
import { OrderStatus, TaskPublic, TaskStatus } from '@prisma/client';
import {
  createOrderRequestSchema,
  orderBodySchema,
  orderParamSchema,
  ownerOrdersPaginationSchema,
  sitterOrdersPaginationSchema,
  updatePaymentStatusOrderBodySchema,
} from '@schema/orders';
import { CheckoutResponse, checkoutRequestSchema } from '@schema/payment';

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

export const getOrderById = async (_req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(_req.params);
  if (!_req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    const targetOrder = await prisma.order.findUnique({
      where: {
        id: order_id,
      },
      omit: {
        task_id: true,
        sitter_user_id: true,
      },
      include: {
        sitter_user: {
          omit: {
            password: true,
            lastPasswordChange: true,
            created_at: true,
            updated_at: true,
          },
        },
        task: true,
      },
    });

    if (!targetOrder) {
      res.status(404).json({
        status: false,
        message: 'Order Not Found',
      });
    }

    res.status(200).json({
      status: true,
      data: targetOrder,
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

export const payforOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const checkoutBody = checkoutRequestSchema.parse(req);
  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    // (1) call API: /payment/checkout
    // (2) 存 stripe id, stripe url
    // (3) redirect front-end url
    const stripeCheckout: AxiosResponse<CheckoutResponse> = await axios.post(
      `${env.NODE_ENV === 'development' ? env.BACK_END_DEV_URL : env.BACK_END_PROD_URL}/api/v1/payment/checkout`,
      checkoutBody.body
    );
    if (!stripeCheckout.data.data.id || !stripeCheckout.data.data.url) {
      return res.status(502).json({
        status: false,
        message: 'Payment System Error! Please try again!',
      });
    }

    // 補：檢查原 order.payment_url 有值，是否過期？過期才更新。
    // 目前：每一次 call API 都更新。
    await prisma.order.update({
      where: {
        id: order_id,
      },
      data: {
        payment_id: stripeCheckout.data.data.id,
        payment_url: stripeCheckout.data.data.url,
      },
    });

    return res.status(200).json({
      status: true,
      data: {
        payment_url: stripeCheckout.data.data.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatusOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = orderParamSchema.parse(req.params);
  const { task_id, payment_at, payment_status, payment_type } = updatePaymentStatusOrderBodySchema.parse(req.body);

  if (!req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  try {
    await prisma.$transaction([
      // 訂單狀態<保姆視角>：任務進度追蹤
      prisma.order.update({
        where: { id: order_id },
        data: {
          status: OrderStatus.TRACKING,
          payment_at: new Date(payment_at * 1000), // stripe 給的是 Unix
          payment_status,
          payment_type,
        },
      }),
      // 訂單狀態<飼主視角>：任務進度追蹤
      prisma.task.update({
        where: {
          user_id: req.user.id,
          id: task_id,
        },
        data: {
          status: TaskStatus.TRACKING,
          public: TaskPublic.IN_TRANSACTION,
        },
      }),
    ]);

    // 服務結束時間 +7天到直接改狀態：後端排程
    // const targetTask = await prisma.task.findUnique({ where: { order_id } });
    // if (targetTask && targetTask.end_at) {
    //   const sevenDaysLater = new Date(targetTask.end_at.getTime() + 7 * 24 * 60 * 60 * 1000);
    //   await agenda.schedule(sevenDaysLater, ORDER_STATUS_JOB, { order_id, user_id: req.user.id, task_id });
    // }

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
  const { limit, page, status, task_id } = ownerOrdersPaginationSchema.parse(_req.query);
  if (!_req.user?.id) {
    throw createHttpError(403, 'Forbidden');
  }

  if (task_id && !ObjectId.isValid(task_id)) {
    res.status(404).json({
      status: false,
      message: 'Bad Request!',
    });
  }

  try {
    const conditions = {
      pet_owner_user_id: _req.user.id,
      status: {
        in: status as OrderStatus[],
      },
      ...(task_id && { task_id }),
    };

    const [data, total] = await prisma.$transaction(async (transaction_prisma) => {
      const getData = await transaction_prisma.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: conditions,
        include: {
          sitter_user: {
            omit: {
              password: true,
              lastPasswordChange: true,
              created_at: true,
              updated_at: true,
            },
          },
          task: true,
        },
        orderBy: {
          updated_at: 'desc',
        },
      });

      const getTotal = await transaction_prisma.order.count({
        where: conditions,
      });

      return [getData, getTotal];
    });

    res.status(200).json({
      data: data || [],
      total,
      total_page: Math.ceil(total / limit),
      status: true,
    });
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
    const [data, total] = await prisma.$transaction(async (transaction_prisma) => {
      const getData = await transaction_prisma.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: conditions,
        orderBy: {
          updated_at: 'desc',
        },
      });
      const getTotal = await transaction_prisma.order.count({
        where: conditions,
      });

      return [getData, getTotal];
    });

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
