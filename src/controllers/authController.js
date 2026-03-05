const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { success, error } = require('../utils/responses');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return error(res, 'User with this email already exists', 409);
    }

    // Create new user
    const user = await User.create(email, password);

    return success(res, {
      id: user.id,
      email: user.email,
      role: user.role,
    }, 'User registered successfully', 201);
  } catch (err) {
    console.error('Registration error:', err);
    return error(res, 'Error during registration', 500);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return error(res, 'Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return error(res, 'Invalid email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    return success(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }, 'Login successful');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Error during login', 500);
  }
};

// Get current user info
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user, 'User profile retrieved');
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, 'Error retrieving user profile', 500);
  }
};
