import { Router } from 'express';
import userRouter from './userRouter';
import cardRouter from './cardRouter';

const router = Router();

router.use(userRouter);
router.use(cardRouter);

export default router;
