import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

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
      validator: (v : string) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true,
        allow_underscores: true,
      }),
      message: 'URL для аватара не валидный',
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
    validate: {
      validator: (v: string) => validator.isLength(v, { min: 8 }) && /[A-Za-z]/.test(v) && /[0-9]/.test(v),
      message: 'Пароль должен содержать минимум 8 символов, включая как минимум одну букву и одну цифру.',
    },
  },
});

UserSchema.static('findUserByCredentials', function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new Error('Invalid email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Invalid email or password'));
          }
          return user;
        });
    });
});

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;
