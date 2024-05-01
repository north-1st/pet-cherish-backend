import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import env from "./env";
import errorHandler from "./middlewares/errorHandler";
import tasksRoutes from "./routes/tasks";
import v1Routes from "./routes/v1";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/tasks", tasksRoutes);
app.use(v1Routes);

app.use(errorHandler);

export default app;
