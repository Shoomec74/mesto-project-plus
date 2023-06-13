import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customRequest';
import { HttpStatus, StatusMessages } from '../utils/constants';
import User from '../models/user';
import ApiError from '../types/errors';
import config from '../config';

const { badRequestError, forbiddenDublicateError, notFoundError } = ApiError;

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          const resUser = user.toObject();
          delete resUser.password;
          delete resUser.__v;
          res.status(HttpStatus.CREATED).send({
            user: { ...resUser },
            message: StatusMessages[201].User,
          });
        })
        .catch((err) => {
          let error;
          if (err.name === 'ValidationError') {
            error = badRequestError(err.message);
            next(error);
          } else if (err.code === 11000) {
            error = forbiddenDublicateError(StatusMessages[409].User);
            next(error);
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  User.find()
    .select('-__v')
    .then((users) => {
      if (users.length === 0) {
        throw notFoundError(StatusMessages[404].Users);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: users, message: StatusMessages[200].User });
      }
    })
    .catch(next);
};

export const getCurrentUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { _id } = req.user!;
  User.findById(_id)
    .select('-__v')
    .then((user) => {
      if (!user) {
        throw notFoundError(StatusMessages[404].UserId);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: user, message: StatusMessages[200].User });
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        next(badRequestError(StatusMessages[400].Id));
      } else {
        next(err);
      }
    });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { id } = req.params;
  User.findById(id)
    .select('-__v')
    .then((user) => {
      if (!user) {
        throw notFoundError(StatusMessages[404].UserId);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: user, message: StatusMessages[200].User });
      }
    })
    .catch((err) => {
      if (err instanceof Error && err.name === 'CastError') {
        next(badRequestError(StatusMessages[400].Id));
      } else {
        next(err);
      }
    });
};

export const updateUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  User.findByIdAndUpdate(
    { _id: req.user!._id },
    { name: req.body.name, about: req.body.about },
    { new: true },
  )
    .select('-__v')
    .then((user) => {
      if (!user) {
        throw notFoundError(StatusMessages[404].UserId);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: user, message: StatusMessages[200].User });
      }
    })
    .catch(next);
};

export const updateUserAvatar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  User.findByIdAndUpdate(
    req.user!._id,
    { avatar: req.body.avatar },
    { new: true },
  )
    .select('-__v')
    .then((user) => {
      if (!user) {
        throw notFoundError(StatusMessages[404].UserId);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: user, message: StatusMessages[200].User });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = badRequestError(err.message);
        next(error);
      } else {
        next(err);
      }
    });
};

export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
      res.cookie('mesto', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
      res
        .status(HttpStatus.OK)
        .send({ message: StatusMessages[200].Login });
    })
    .catch(next);
};
