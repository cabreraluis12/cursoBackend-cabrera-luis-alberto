import winston from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const developmentLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
    }),
  ],
});

const productionLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

export { developmentLogger, productionLogger };