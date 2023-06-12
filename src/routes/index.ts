import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import userRouter from './userRouter';
import cardRouter from './cardRouter';
import ApiError from '../types/errors';
import { StatusMessages } from '../utils/constants';

const router = Router();

router.use(userRouter);
router.use(cardRouter);
router.use((req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFoundError(StatusMessages[404].Route));
});

export default router;
