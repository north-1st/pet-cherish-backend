import express from "express";
import * as TasksController from "../controllers/tasks";

const router = express.Router();

router.get("/", TasksController.getTasks);

export default router;
