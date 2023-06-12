import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import ApiError from '../types/errors';
import { StatusMessages } from '../utils/constants';
import config from '../config';

const { authUserError } = ApiError;

interface IPayload {
  readonly _id: string | ObjectId;
}

interface IRequestWithUser extends Request {
  user?: IPayload;
}

export default (req: IRequestWithUser, res: Response, next: NextFunction) => {
  // eslint-disable-next-line dot-notation
  const token = req.cookies['mesto'];

  if (!token) {
    throw authUserError(StatusMessages[401].Auth);
  }

  let payload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (e) {
    const error = authUserError(StatusMessages[401].Auth);
    next(error);
  }
  req.user = payload as IPayload;
  return next();
};
