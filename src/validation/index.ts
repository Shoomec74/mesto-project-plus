import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';

// Функция создает валидатор для заданных сегментов и поллей сегмента //
const createValidator = (schemas: {
  // eslint-disable-next-line no-unused-vars
  [segment in Segments]?: Joi.ObjectSchema }) => celebrate(schemas, { abortEarly: true });

export default createValidator;
