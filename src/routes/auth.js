const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, schemas } = require('../utils/validation');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', validate(schemas.register), authController.register);
router.post('/login', validate(schemas.login), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
