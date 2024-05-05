import { Request } from 'express';

export interface CreateOrdersRequest extends Request {
  body: {
    task_id: string;
    user_id: string;
  };
}
