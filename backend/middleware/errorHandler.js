 const logger = require('../utils/logger');
const config = require('../config/config');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  // Set status code
  const statusCode = err.statusCode || 500;
  
  // Create error response
  const errorResponse = {
    error: config.nodeEnv === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong'
  };
  
  // Add stack trace in development
  if (config.nodeEnv === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  // Send response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;