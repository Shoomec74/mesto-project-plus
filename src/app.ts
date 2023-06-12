import express, {
  json,
} from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errorLogger, requestLogger } from './middlewares/logger';
import routes from './routes';
import config from './config';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import errorsHandler from './middlewares/errorsHandler';
import createValidator from './validation';
import { loginSchema, userSchema } from './validation/userSchemesValidations';

const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT, MONGO_URI } = config;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const app = express();
app.use(helmet());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.post('/signin', createValidator(loginSchema), login);
app.post('/signup', createValidator(userSchema), createUser);
app.use(auth);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MondoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.set('strictQuery', false);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
