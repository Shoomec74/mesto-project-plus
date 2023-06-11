require('dotenv').config();

interface IConfig {
  readonly MONGO_URI: string;
  readonly PORT: string | number;
  readonly JWT_SECRET: string;
  readonly TEL_TOKEN: string;
  readonly CHAT_ID: string;
}

const {
  NODE_ENV, MONGO_URI, PORT, JWT_SECRET, TEL_TOKEN, CHAT_ID,
} = process.env;

// eslint-disable-next-line import/no-mutable-exports
let config: IConfig;
if (NODE_ENV === 'production') {
  if (!MONGO_URI || !PORT || !JWT_SECRET || !TEL_TOKEN || !CHAT_ID) {
    throw new Error('Отсутствует файл .env');
  }
  config = {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    TEL_TOKEN,
    CHAT_ID,
  };
} else {
  config = {
    MONGO_URI: 'mongodb://localhost:27017/mestodb',
    PORT: 3000,
    JWT_SECRET: 'top secrets',
    TEL_TOKEN: '6236760779:AAEm82krZN1macQDwHZdSAUgxl6sVAoEQJU',
    CHAT_ID: '450002632',
  };
}

export default config;
