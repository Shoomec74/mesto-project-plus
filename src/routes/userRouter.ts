import { Router } from 'express';
import {
  createUser,
  getUser,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.post('/users', createUser);
userRouter.get('/users/:id', getUser);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);

export default userRouter;
