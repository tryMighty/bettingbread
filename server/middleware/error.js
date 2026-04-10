const logger = require('../utils/logger');

/**
 * Global Error Handler.
 * Logs detailed error information and sends sanitized responses to the client.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log the error with full context
  logger.error('Unhandled Application Error', {
    status: statusCode,
    message: err.message,
    stack: !isProduction ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user_id: req.user?.discord_id,
    request_id: req.id
  });

  // Handle specific error types (e.g., Zod validation)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.flatten(),
      request_id: req.id
    });
  }

  res.status(statusCode).json({
    error: isProduction ? 'An unexpected error occurred. Please try again later.' : err.message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    request_id: req.id // Provide request ID for user support
  });
};

module.exports = { errorHandler };
