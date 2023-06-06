import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { CustomRequest } from '../app';
import Card from '../models/card';
import { HttpStatus, StatusMessages } from '../utils/constants';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  Card.find().select('-__v')
    .then((cards) => {
      if (cards.length === 0) {
        res
          .status(HttpStatus.NOT_FOUND)
          .send({ error: StatusMessages[404].Cards });
      } else {
        res
          .status(HttpStatus.OK)
          .send({ data: cards, message: StatusMessages[200].Card });
      }
    })
    .catch((err) => {
      res
        .status(HttpStatus.SERVER_ERROR)
        .send({ error: StatusMessages[500].Card });
      next(err);
    });
};

export const createCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, link } = req.body;

  if (!name || !link) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ error: StatusMessages[400].Card });
  } else {
    Card.create({
      name,
      link,
      owner: req.user?._id,
    })
      .then((card) => {
        card.save();
        res
          .status(HttpStatus.CREATED)
          .send({ data: card, message: StatusMessages[201].Card });
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].Card });
        next(err);
      });
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const _id = req.params.cardId;

  if (!_id) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].Card });
  } else {
    Card.findById({ _id })
      .then((card) => {
        if (!card) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].CardId });
        }
        card?.remove();
        res.status(HttpStatus.OK).send({ message: StatusMessages[200].Card });
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].Card });
        next(err);
      });
  }
};

export const likeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;

  if (!cardId) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].Card });
  } else {
    Card.findByIdAndUpdate(
      { cardId },
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    )
      .then((card) => {
        if (!card) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].LikeCard });
        } else {
          card.save();
          res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
        }
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].Card });
        next(err);
      });
  }
};

export const dislikeCard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  if (!cardId) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: StatusMessages[400].Card });
  } else {
    const userID = req.user?._id as unknown as ObjectId;
    Card.findByIdAndUpdate(cardId, { $pull: { likes: userID } }, { new: true })
      .then((card) => {
        if (!card) {
          res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: StatusMessages[404].LikeCard });
        } else {
          card.save();
          res.status(HttpStatus.OK).send({ data: card, message: StatusMessages[200].Card });
        }
      })
      .catch((err) => {
        res
          .status(HttpStatus.SERVER_ERROR)
          .send({ error: StatusMessages[500].Card });
        next(err);
      });
  }
};
