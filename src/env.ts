import { cleanEnv, email, num, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  WEBSITE_URL: str(),
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
});

export default env;
