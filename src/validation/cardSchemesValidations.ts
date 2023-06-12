import { Segments } from 'celebrate';
import Joi from 'joi';

export const cardSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
};

export const cardIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
