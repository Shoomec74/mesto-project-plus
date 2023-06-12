import {
  NextFunction, Request, Response,
} from 'express';
import ApiError from '../types/errors';

interface IExpressError extends Error {
  code?: number;
}

const errorsHandler = (err: IExpressError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError && err.code) {
    res.status(err.code).json({ message: err.message });
  } else {
    const error = ApiError.serverError(err.message);
    res.status(error.code).json({ error: error.message });
  }
  next(err);
};

export default errorsHandler;
