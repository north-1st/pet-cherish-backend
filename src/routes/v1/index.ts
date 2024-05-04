import orderRouter from "./orders";
import { Router } from "express"

const router = Router();
// 之後要補 User 登入檢查的 middleware，還要同時回傳 user_id 給 controller 使用
router.use("/api/v1", orderRouter);


export default router;