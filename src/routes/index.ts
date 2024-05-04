import express from "express";
import tasksV1 from "./v1/tasks";

const router = express();

router.use("/v1/tasks", tasksV1);

export default router;
