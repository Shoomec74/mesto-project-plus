import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../app';
import { HttpStatus, StatusMessages } from '../utils/constants';
import User from '../models/user';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].User });
  } else {
    User.create({
      name,
      about,
      avatar,
    })
      .then((user) => {
        user.save();
        res.status(HttpStatus.CREATED).send(
          {
            data: { ...req.body, _id: user._id },
            message: StatusMessages[201].User,
          },
        );
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].User });
        next(err);
      });
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  User.find().select('-__v')
    .then((users) => {
      if (users.length === 0) {
        res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: StatusMessages[404].Users });
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: users, message: StatusMessages[200].User });
      }
    })
    .catch((err) => {
      res
        .status(HttpStatus.SERVER_ERROR)
        .send({ error: StatusMessages[500].User });
      next(err);
    });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { id } = req.params;
  if (!id) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].User });
  } else {
    User.findById(id).select('-__v')
      .then((user) => {
        if (!user) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].UserId });
        } else {
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].User });
        next(err);
      });
  }
};

export const updateUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, about } = req.body;
  if (!name || !about) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].User });
  } else {
    User.findByIdAndUpdate(
      { _id: req.user?._id },
      { name: req.body.name, about: req.body.about },
      { new: true },
    )
      .select('-__v')
      .then((user) => {
        if (!user) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].UserId });
        } else {
          user.save();
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].User });
        next(err);
      });
  }
};

export const updateUserAvatar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { avatar } = req.body;

  if (!avatar) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].User });
  } else {
    User.findByIdAndUpdate(
      req.user?._id,
      { avatar: req.body.avatar },
      { new: true },
    )
      .select('-__v')
      .then((user) => {
        if (!user) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].UserId });
        } else {
          user.save();
          res
            .status(HttpStatus.OK)
            .send({ data: user, message: StatusMessages[200].User });
        }
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].User });
        next(err);
      });
  }
};
