import {
  Errback, NextFunction, Request, Response,
} from 'express';
import ApiError from '../types/errors';

const errorsHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ error: 'На сервере произошла ошибка' });
  }
  next();
};

export default errorsHandler;
