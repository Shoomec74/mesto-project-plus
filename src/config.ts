interface IConfig {
  MONGO_URI: string;
  PORT: string | number;
}

const config: IConfig = process.env.NODE_ENV === 'production' ? {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mesto',
  PORT: process.env.PORT || 3002,
} : {
  MONGO_URI: 'mongodb://localhost:27017/mestodb',
  PORT: 3000,
};

export default config;
