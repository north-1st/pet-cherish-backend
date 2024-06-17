import { Job } from 'agenda';

import agenda from '@job';
import prisma from '@prisma';
import { OrderStatus, TaskPublic, TaskStatus } from '@prisma/client';

interface OrderStatusJobData {
  order_id: string;
  user_id: string;
  task_id: string;
}
export const ORDER_STATUS_JOB = 'Update order status completed';
agenda.define<OrderStatusJobData>(ORDER_STATUS_JOB, async (job: Job<OrderStatusJobData>) => {
  const { order_id, user_id, task_id } = job.attrs.data;
  const order = await prisma.order.findUnique({ where: { id: order_id } });
  if (order) {
    await prisma.$transaction([
      // 訂單狀態<保姆視角>：任務進度追蹤
      prisma.order.update({
        where: { id: order_id },
        data: { status: OrderStatus.TRACKING },
      }),
      // 訂單狀態<飼主視角>：任務進度追蹤
      prisma.task.update({
        where: {
          user_id,
          id: task_id,
        },
        data: {
          status: TaskStatus.TRACKING,
          public: TaskPublic.IN_TRANSACTION,
        },
      }),
    ]);
  }
});
