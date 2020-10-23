const loggerHandler = {};

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const config = require('../config/config.js');

const logErrorName = config.logger.error_name;
let logErrorPath = config.logger.error_path;


if (process.env.NODE_ENV === "production"){
  loggerHandler.logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.prettyPrint()
    ),
    transports: [
      new DailyRotateFile({
        timestamp: winston.format.timestamp(),
        filename: logErrorName,
        dirname: logErrorPath,
        datePattern: 'YYYY-MM-DD',
        prepend: true,
        level: 'error'
      })
    ]
  });
  
}else{

  loggerHandler.logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
        timestamp: winston.format.timestamp(),
        filename: logErrorName,
        dirname: logErrorPath,
        datePattern: 'YYYY-MM-DD',
        prepend: true,
        level: 'error'
      })
    ]
  });
  
}
module.exports = loggerHandler;