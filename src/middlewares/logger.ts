import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import winstonTelegram from 'winston-telegram';
import config from '../config';

const telegramOptions: winstonTelegram.Options = {
  token: config.TEL_TOKEN,
  chatId: +config.CHAT_ID,
  level: '',
};

const fileOptions: DailyRotateFile.DailyRotateFileTransportOptions = {
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d',
  filename: '',
};

export const requestLogger = expressWinston.logger({
  transports: [
    new DailyRotateFile({
      ...fileOptions,
      filename: 'request-%DATE%.log',
    }),
    // eslint-disable-next-line new-cap
    new winstonTelegram({
      ...telegramOptions,
      level: 'info',
      // eslint-disable-next-line quotes
      template: `${new Date().toLocaleTimeString()} был сделан запрос к эндпоинту [{message}]`,
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new DailyRotateFile({
      ...fileOptions,
      filename: 'error-%DATE%.log',
    }),
    // eslint-disable-next-line new-cap
    new winstonTelegram({
      ...telegramOptions,
      level: 'error',
      // eslint-disable-next-line quotes
      template: `${new Date().toLocaleTimeString()} на сервере произошла ошибка [{message}]`,
    }),
  ],
  format: winston.format.json(),
});
