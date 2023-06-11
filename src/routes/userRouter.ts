import { Router } from 'express';
import {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);
userRouter.get('/users/:id', getUser);

export default userRouter;
