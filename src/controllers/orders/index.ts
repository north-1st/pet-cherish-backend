import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma";
import { CreateOrdersRequest, UpdateOrdersRequest } from "../../types/orders";
import { OrderStatus, Prisma, TaskPublic, TaskStatus } from "@prisma/client";

export const createOrder = async (req: CreateOrdersRequest, res: Response, next: NextFunction) => {
    const {task_id, user_id} = req.body;
    if(!task_id || !user_id){
        res.status(400).json({
            message : "Bad Request!",
            status: false
        });
        return;
    };

    try{
        const existingLiveTaskOrders = await prisma.order.findMany({
            where: {
                AND: [
                    {task_id},
                    {status: {notIn: ["CANCELED", "INVALID"]}}
                ]
            }
        });
        if(existingLiveTaskOrders.length > 0){
            res.status(409).json({
                message : "Order has been created!",
                status: false
            });
            return;
        };

        const targetTask = await prisma.task.findUnique({
            where: {
                id: task_id
            }
        });
        if(targetTask === null){
            res.status(404).json({
                message : "Task not found!",
                status: false
            });
            return;
        }
        
        const data = {
            sitter_user_id: user_id,
            task_id,
            pet_owner_user_id: targetTask.user_id,
            report_content: "",
            report_image_list: [],
        };
        const newOrder = await prisma.order.create({data});
        res.status(201).json({
          data: newOrder,
          status: true
        });

    }catch(error){
        next(error);
    }
}

/**
 * 提問紀錄：
 * (1) 要不要補傳參數：task_id，我可以少去 DB 要 Order.task_id
 * (2) 回傳成功訊息：因為會做兩件事，拒絕保姆好像不用回傳更新資料。
 * 
 */
export const updateOrdersByRefuseSitter = async (req: UpdateOrdersRequest, res: Response, next: NextFunction) => {
  const { order_id } = req.params;
  const { user_id } = req.body;

  if(!user_id){
    res.status(400).json({
        message : "Bad Request!",
        status: false
    });
    return;
  }

  try{
    const targetOrder = await prisma.order.findUnique({
        where: {
            id: order_id,
            sitter_user_id: user_id
        }
    });
    if(!targetOrder){
      res.status(404).json({
          message : "Order not found!",
          status: false
      });
      return;
    }

    // 訂單狀態<保姆視角>：未成立
    await prisma.order.update({
      where: {
        id: order_id
      },
      data: {
        status: OrderStatus.INVALID
      }
    });

    // 飼主任務：若所有接單申請需求都拒絕，修改 Task.status
    const pendingOrders = await prisma.order.findMany({
      where: {
        task_id: targetOrder.task_id,
        pet_owner_user_id: user_id,
        status: OrderStatus.PENDING
      }
    });

    if(pendingOrders.length === 0){
      await prisma.task.update({
        where: {
          id: targetOrder.task_id,
          user_id
        },
        data: {
          status: TaskStatus.NULL
        }
      });
    }

    res.status(200).json({
      data: "Update Successfully!",
      status: true
    });

  }catch(error){
    next(error);
  }
}

export const updateOrdersByAcceptSitter = async (req: UpdateOrdersRequest, res: Response, next: NextFunction) => {
  const { order_id } = req.params;
  const { user_id } = req.body;

  if(!user_id){
    res.status(400).json({
        message : "Bad Request!",
        status: false
    });
    return;
  }

  try{
    // 訂單狀態<保姆視角>：已成立
    const updateResultBySitter = await prisma.order.update({
      where: {
        id: order_id
      },
      data: {
        status: OrderStatus.VALID
      }
    });
    res.status(200).json({
      data: updateResultBySitter,
      status: true
    });

    // 訂單狀態<飼主視角>：待付款 TBD
    const updateResultByOwner = await prisma.task.update({
      where: {
        user_id,
        order_id
      },
      data: {
        status: TaskStatus.UN_PAID
      }
    });
    res.status(200).json({
      data: updateResultByOwner,
      status: true
    });

    // 同時拒絕多個保姆 


  }catch(error){
    next(error);
  }
}

export const updateOrdersByPaid = async (req: UpdateOrdersRequest, res: Response, next: NextFunction) => {
  const { order_id } = req.params;
  const { user_id } = req.body;

  if(!user_id){
    res.status(400).json({
        message : "Bad Request!",
        status: false
    });
    return;
  }

  try{
    // 訂單狀態<保姆視角>：任務進度追蹤
    const updateResultBySitter = await prisma.order.update({
      where: {
        id: order_id
      },
      data: {
        status: OrderStatus.TRACKING
      }
    });
    res.status(200).json({
      data: updateResultBySitter,
      status: true
    });

    // 訂單狀態<飼主視角>：任務進度追蹤 TBD
    const updateResultByOwner = await prisma.task.update({
      where: {
        user_id,
        order_id
      },
      data: {
        status: TaskStatus.UN_PAID,
        public: TaskPublic.IN_TRANSACTION
      }
    });
    res.status(200).json({
      data: updateResultByOwner,
      status: true
    });
  }catch(error){
    next(error);
  }
}

export const updateOrdersByComplete = async (req: UpdateOrdersRequest, res: Response, next: NextFunction) => {
  const { order_id } = req.params;
  const { user_id } = req.body;

  if(!user_id){
    res.status(400).json({
        message : "Bad Request!",
        status: false
    });
    return;
  }

  try{
    // 訂單狀態<保姆視角>：已完成
    const updateResultBySitter = await prisma.order.update({
      where: {
        id: order_id
      },
      data: {
        status: OrderStatus.COMPLETED
      }
    });
    res.status(200).json({
      data: updateResultBySitter,
      status: true
    });

    // 訂單狀態<飼主視角>：已完成 TBD
    const updateResultByOwner = await prisma.task.update({
      where: {
        user_id,
        order_id
      },
      data: {
        status: TaskStatus.COMPLETED,
        public: TaskPublic.COMPLETED
      }
    });
    res.status(200).json({
      data: updateResultByOwner,
      status: true
    });

    // （補）7天到直接改狀態：後端排程

  }catch(error){
    next(error);
  }
}

export const updateOrdersByCancel = async (req: UpdateOrdersRequest, res: Response, next: NextFunction) => {
  const { order_id } = req.params;
  const { user_id } = req.body;

  if(!user_id){
    res.status(400).json({
        message : "Bad Request!",
        status: false
    });
    return;
  }

  try{
    // 訂單狀態<保姆視角>：已取消
    const updateResultBySitter = await prisma.order.update({
      where: {
        id: order_id
      },
      data: {
        status: OrderStatus.CANCELED
      }
    });
    res.status(200).json({
      data: updateResultBySitter,
      status: true
    });

    // 訂單狀態<飼主視角>：已完成 TBD
    const updateResultByOwner = await prisma.task.update({
      where: {
        user_id,
        order_id,
      },
      data: {
        order_id: undefined,
        status: TaskStatus.NULL,
        public: TaskPublic.OPEN
      }
    });
    res.status(200).json({
      data: updateResultByOwner,
      status: true
    });
  }catch(error){
    next(error);
  }
}

export const getPetOwnerOrders = async (req: Request, res: Response, next: NextFunction) => {

}

export const getSitterOrders = async (req: Request, res: Response, next: NextFunction) => {

}
