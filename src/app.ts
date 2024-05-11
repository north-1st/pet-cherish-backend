import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import env from '@env';
import errorHandler from '@middlewares/errorHandler';
import routes from '@routes/index';
import swaggerDocument from '@swagger.json';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
