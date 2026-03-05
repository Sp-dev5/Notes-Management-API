const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/responses');

// Authentication middleware - verifies JWT token
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return error(res, 'No authentication token provided', 401);
    }

    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired', 401);
    }
    return error(res, 'Invalid or malformed token', 401);
  }
};

// Authorization middleware - checks user role
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'You do not have permission to access this resource', 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
