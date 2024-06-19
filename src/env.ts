import { cleanEnv, email, num, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  DATABASE_URL: str(),
  FRONT_END_URL: str(),
  BACK_END_URL: str(),
  SESSION_SECRET: str(),
  JWT_ACCESS_SECRET: str(),
  FIREBASE_TYPE: str(),
  FIREBASE_PROJECT_ID: str(),
  FIREBASE_PRIVATE_KEY_ID: str(),
  FIREBASE_PRIVATE_KEY: str(),
  FIREBASE_CLIENT_EMAIL: email(),
  FIREBASE_CLIENT_ID: num(),
  FIREBASE_AUTH_URI: url(),
  FIREBASE_TOKEN_URI: url(),
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: url(),
  FIREBASE_CLIENT_X509_CERT_URL: url(),
  BACK_END_DEV_URL: str(),
  BACK_END_PROD_URL: str(),
  PORT: num(),
  STRIPE_SECRET: str(),
});

export default env;
