import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const CardSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v : string) => validator.isURL(v, {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true,
        allow_underscores: true,
      }),
      message: 'The card url is not valid',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model<ICard>('Card', CardSchema);

export default Card;
