import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/card';
import createValidator from '../validation';
import { cardSchema, cardIdSchema } from '../validation/cardSchemesValidations';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createValidator(cardSchema), createCard);
cardRouter.delete('/cards/:cardId', createValidator(cardIdSchema), deleteCard);
cardRouter.put('/cards/:cardId/likes', createValidator(cardIdSchema), likeCard);
cardRouter.delete('/cards/:cardId/likes', createValidator(cardIdSchema), dislikeCard);

export default cardRouter;
