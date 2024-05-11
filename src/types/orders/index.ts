import {Request} from "express"; 

export interface CreateOrdersRequest extends Request {
    body: {
        task_id: string; 
        user_id: string;
    }
}

export interface UpdateOrdersRequest extends Request {
    body: {
        user_id: string;
        task_id: string;
    }
}