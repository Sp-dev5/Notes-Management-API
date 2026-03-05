const { error } = require('../utils/responses');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Database errors
  if (err.code === '23505') {
    // Unique constraint violation
    return error(res, 'A user with this email already exists', 409);
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return error(res, 'Referenced resource not found', 404);
  }

  // Custom errors
  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  // Default error
  return error(res, 'Internal server error', 500);
};

// 404 handler - should be last
const notFound = (req, res) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorHandler,
  notFound,
};
