/**
 * Global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status
  });
};

module.exports = { errorHandler };
