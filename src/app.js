const express = require('express');
const env = require('./config/env');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (simple version)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Default API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: env.app.name,
    version: env.app.apiVersion,
    message: 'Notes Management API',
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      health: '/health',
    },
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
