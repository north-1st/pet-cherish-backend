import express from "express";
import usersV1 from "./v1/users";
import tasksV1 from "./v1/tasks";

const router = express();

router.use("/v1/users", usersV1);
router.use("/v1/tasks", tasksV1);

export default router;
