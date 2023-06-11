import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { CustomRequest } from '../types/customRequest';
import Card from '../models/card';
import { HttpStatus, StatusMessages } from '../utils/constants';
import ApiError from '../types/errors';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  Card.find().select('-__v')
    .then((cards) => {
      if (cards.length === 0) {
        throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].Cards);
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

  if (!name || !link) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].Card);
  } else {
    Card.create({
      name,
      link,
      owner: req.user!._id,
    })
      .then((card) => {
        card.save();
        res
          .status(HttpStatus.CREATED)
          .send({ data: card, message: StatusMessages[201].Card });
      })
      .catch(next);
  }
};

export const deleteCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const _id = req.params.cardId;
  const ownerId = req.user!._id;
  if (!_id) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].Card);
  } else {
    Card.findById({ _id })
      .then((card) => {
        if (!card) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].CardId);
        } else if (card.owner.toString() !== ownerId) {
          throw new ApiError(HttpStatus.FORBIDDEN_TO_DELETE, StatusMessages[403].Card);
        } else {
          card.remove();
          res.status(HttpStatus.OK).send({ message: StatusMessages[200].Card });
        }
      })
      .catch(next);
  }
};

export const likeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;

  if (!cardId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].Card);
  } else {
    Card.findByIdAndUpdate(
      { cardId },
      { $addToSet: { likes: req.user!._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].LikeCard);
        } else {
          card.save();
          res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
        }
      })
      .catch(next);
  }
};

export const dislikeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  if (!cardId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, StatusMessages[400].Card);
  } else {
    const userID = req.user?._id as unknown as ObjectId;
    Card.findByIdAndUpdate(cardId, { $pull: { likes: userID } }, { new: true })
      .then((card) => {
        if (!card) {
          throw new ApiError(HttpStatus.NOT_FOUND, StatusMessages[404].LikeCard);
        } else {
          card.save();
          res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
        }
      })
      .catch(next);
  }
};
