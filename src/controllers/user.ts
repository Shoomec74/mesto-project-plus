import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customRequest';
import { HttpStatus, StatusMessages } from '../utils/constants';
import User from '../models/user';
import ApiError from '../types/errors';
import config from '../config';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!name || !about || !avatar || !email || !password) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].User);
  } else {
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
            user.save();
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
            if (err.message.includes('is not a valid email')) {
              error = new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].Email);
              next(error);
            } else if (err.code === 11000) {
              error = new ApiError(HttpStatus.DUBLICATE_EMAIL, StatusMessages[409].User);
              next(error);
            } else {
              next(err);
            }
          });
      })
      .catch(next);
  }
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
        throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].Users);
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
        throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].Users);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: user, message: StatusMessages[200].User });
      }
    })
    .catch(next);
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].User);
  } else {
    User.findById(id)
      .select('-__v')
      .then((user) => {
        if (!user) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].UserId);
        } else {
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch(next);
  }
};

export const updateUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].User);
  } else {
    User.findByIdAndUpdate(
      { _id: req.user!._id },
      { name: req.body.name, about: req.body.about },
      { new: true },
    )
      .select('-__v')
      .then((user) => {
        if (!user) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].UserId);
        } else {
          user.save();
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch(next);
  }
};

export const updateUserAvatar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].User);
  } else {
    User.findByIdAndUpdate(
      req.user?._id,
      { avatar: req.body.avatar },
      { new: true },
    )
      .select('-__v')
      .then((user) => {
        if (!user) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].UserId);
        } else {
          user.save();
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch(next);
  }
};

export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].User);
  } else {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
        res
          .status(HttpStatus.OK)
          .send({ message: StatusMessages[200].Login });
      })
      .catch((err) => {
        let error;
        if (err.message.includes('email or password')) {
          error = new ApiError(HttpStatus.BAD_LOGIN, StatusMessages[401].Login);
          next(error);
        } else {
          next(err);
        }
      });
  }
};
