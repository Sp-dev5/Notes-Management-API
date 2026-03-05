const Joi = require('joi');

// Define validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createNote: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').optional(),
  }),

  updateNote: Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    content: Joi.string().allow('').optional(),
  }),
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas,
};
