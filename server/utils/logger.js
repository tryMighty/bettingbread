const winston = require('winston');
const path = require('path');

/**
 * Custom log format for structured JSON logging.
 * Includes timestamp, level, message, and any additional metadata.
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const DailyRotateFile = require('winston-daily-rotate-file');

/**
 * Main logger instance using winston.
 * Configured with daily rotating file transports and console transport.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'betting-bread-server' },
  transports: [
    // Error logs: Rotate daily, keep for 14 days, max 20MB per file
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
    // Combined logs: Rotate daily, keep for 14 days, max 20MB per file
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

/**
 * Configure console logging for non-production environments.
 * Uses colorized simple format for better developer experience.
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
      })
    ),
  }));
}

module.exports = logger;

