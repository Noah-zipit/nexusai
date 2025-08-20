const winston = require('winston');
const config = require('../config/config');

// Define log formats
const formats = {
  dev: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      const restString = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
      return `${timestamp} ${level}: ${message} ${restString}`;
    })
  ),
  json: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
};

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: formats[config.logging.format],
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;