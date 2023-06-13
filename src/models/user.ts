import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import ApiError from '../types/errors';
import { StatusMessages } from '../utils/constants';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  readonly email: string,
  readonly password: string,
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: async (v : string) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true,
        allow_underscores: true,
      }),
      message: 'The avatar url is not valid',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.static('findUserByCredentials', function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        throw ApiError.authUserError(StatusMessages[401].Login);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw ApiError.authUserError(StatusMessages[401].Login);
          }
          return user;
        });
    });
});

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;
