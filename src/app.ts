import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

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

app.use(
  cors({
    // origin: env.WEBSITE_URL,
  })
);

// app.use(session(sessionConfig));

// app.use(passport.authenticate('session'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
