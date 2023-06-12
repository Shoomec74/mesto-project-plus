import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { CustomRequest } from '../types/customRequest';
import Card from '../models/card';
import { HttpStatus, StatusMessages } from '../utils/constants';
import ApiError from '../types/errors';

const { notFoundError, forbiddenError, badRequestError } = ApiError;

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  Card.find().select('-__v')
    .then((cards) => {
      if (cards.length === 0) {
        throw notFoundError(StatusMessages[404].Cards);
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: cards, message: StatusMessages[200].Card });
      }
    })
    .catch(next);
};

export const createCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user!._id,
  })
    .then((card) => {
      res
        .status(HttpStatus.CREATED)
        .send({ data: card, message: StatusMessages[201].Card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(badRequestError(err.message));
      } else {
        next(err);
      }
    });
};

export const deleteCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const _id = req.params.cardId;
  const ownerId = req.user!._id;
  Card.findById({ _id })
    .then((card) => {
      if (card!.owner.toString() !== ownerId) {
        throw forbiddenError(StatusMessages[403].Card);
      } else {
        card!.remove()
          .then(() => res.status(HttpStatus.OK).send({ message: StatusMessages[200].Card }))
          .catch(next);
      }
    })
    .catch(() => {
      next(notFoundError(StatusMessages[404].CardId));
    });
};

export const likeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user!._id } },
    { new: true },
  )
    .then((card) => {
      res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
    })
    .catch(() => {
      next(notFoundError(StatusMessages[404].LikeCard));
    });
};

export const dislikeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  const userID = req.user!._id as ObjectId;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userID } }, { new: true })
    .then((card) => {
      res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
    })
    .catch(() => {
      next(notFoundError(StatusMessages[404].LikeCard));
    });
};
