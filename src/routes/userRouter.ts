import { Router } from 'express';
import {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/user';
import createValidator from '../validation';
import { updateUserAvatarSchema, updateUserInfoSchema, userIdSchema } from '../validation/userSchemesValidations';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.patch('/users/me', createValidator(updateUserInfoSchema), updateUserInfo);
userRouter.patch('/users/me/avatar', createValidator(updateUserAvatarSchema), updateUserAvatar);
userRouter.get('/users/:id', createValidator(userIdSchema), getUser);

export default userRouter;
