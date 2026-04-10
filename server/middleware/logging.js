const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * Middleware to attach a request-scoped logger to each request.
 * Automatically injects request_id and user context into all logs.
 */
const requestLogger = (req, res, next) => {
  // Use existing request ID or generate a new one
  const requestId = req.id || req.headers['x-request-id'] || crypto.randomUUID();
  req.id = requestId;

  // Attach child logger to request object
  req.log = logger.child({
    request_id: requestId,
    user_id: req.user?.discord_id || 'unauthenticated',
    method: req.method,
    url: req.originalUrl
  });

  // Log request start
  req.log.info(`${req.method} ${req.originalUrl} - Initiation`);

  // Log request completion with status code and duration
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const level = statusCode >= 400 ? 'warn' : 'info';
    
    req.log.log(level, `${req.method} ${req.originalUrl} - Completed ${statusCode}`, {
      status_code: statusCode,
      duration_ms: duration
    });
  });

  next();
};

module.exports = requestLogger;
