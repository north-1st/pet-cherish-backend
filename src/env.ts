import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  WEBSITE_URL: str(),
  SESSION_SECRET: str(),
});

export default env;
