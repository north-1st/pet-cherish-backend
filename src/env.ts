import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  WEBSITE_URL: str(),
  SESSION_SECRET: str(),
  JWT_ACCESS_SECRET_KEY: str(),
});

export default env;
