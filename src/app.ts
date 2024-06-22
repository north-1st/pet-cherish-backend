import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { seedDatabase } from '@prisma/seed';
import swaggerDocument from '@swagger.json';

import './config/passport';
import sessionConfig from './config/session';
import env from './env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes/index';

const app = express();

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// 配置CORS以允许所有来源和所有方法
app.use(
  cors({
    origin: env.FRONT_END_URL, // 允许的前端URL
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: true,
  })
);

// 处理预检请求
app.options('*', cors());

// app.use(session(sessionConfig));

// app.use(passport.authenticate('session'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/init', async (req, res) => {
  try {
    await seedDatabase();
    res.send('Database initialized successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while initializing the database');
  }
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
