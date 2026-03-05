const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { validate, schemas } = require('../utils/validation');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// User routes - create note
router.post('/', validate(schemas.createNote), notesController.createNote);

// User routes - get user's notes and search
router.get('/', notesController.getUserNotes);

// User routes - get, update, delete specific note
router.get('/:id', notesController.getNote);
router.put('/:id', validate(schemas.updateNote), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// Admin routes - get all notes
router.get('/admin/all-notes', authorize(['admin']), notesController.getAllNotes);

module.exports = router;
