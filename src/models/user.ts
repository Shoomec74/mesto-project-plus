import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;