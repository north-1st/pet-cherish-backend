import { Request } from 'express';

export interface OrdersRequest extends Request {
  body: {
    user_id: string;
    task_id: string;
  };
}
