/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, message, level, time }) => {
              const strApp = chalk.green('[NEST] -');
              const strContext = chalk.yellow(`[${context}]`);
              return `${strApp} ${time} ${level} ${strContext} ${message}`;
            }),
          ),
        }),
        this.dailyRotateTransport('info'),
        this.dailyRotateTransport('error'),
      ],
    });
  }

  dailyRotateTransport(level: string) {
    return new transports.DailyRotateFile({
      level,
      dirname: `logs/${level}`,
      filename: `%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    });
  }

  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('error', message, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('warn', message, { context, time });
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }

  debug(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('debug', message, { context, time });
  }

  fatal(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('fatal', message, { context, time });
  }

  verbose(message: string, context: string) {
    const time = dayjs(Date.now()).format('DD/MM/YYYY, HH:mm:ss');
    this.logger.log('verbose', message, { context, time });
  }
}
