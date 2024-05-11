import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import env from "./env";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes/index";
import swaggerDocument from "../src/swagger.json";
import sessionConfig from "./config/session";
import passport from "passport";
import "./config/passport";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
);

app.use(session(sessionConfig));

app.use(passport.authenticate("session"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
