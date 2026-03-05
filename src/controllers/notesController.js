const Note = require('../models/Note');
const User = require('../models/User');
const { success, error } = require('../utils/responses');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const note = await Note.create(userId, title, content);

    return success(res, note, 'Note created successfully', 201);
  } catch (err) {
    console.error('Create note error:', err);
    return error(res, 'Error creating note', 500);
  }
};

// Get all notes of authenticated user
exports.getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search } = req.query;

    const offset = (page - 1) * limit;

    let notes;
    if (search) {
      notes = await Note.searchByTitle(userId, search, limit, offset);
    } else {
      notes = await Note.findByUserId(userId, limit, offset);
    }

    const total = await Note.countByUserId(userId);

    return success(res, {
      notes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    }, 'Notes retrieved successfully');
  } catch (err) {
    console.error('Get user notes error:', err);
    return error(res, 'Error retrieving notes', 500);
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const note = await Note.findById(id);

    if (!note) {
      return error(res, 'Note not found', 404);
    }

    // Check ownership (regular users can only see their own notes)
    if (userRole !== 'admin' && note.user_id !== userId) {
      return error(res, 'You do not have permission to view this note', 403);
    }

    return success(res, note, 'Note retrieved successfully');
  } catch (err) {
    console.error('Get note error:', err);
    return error(res, 'Error retrieving note', 500);
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const note = await Note.findById(id);

    if (!note) {
      return error(res, 'Note not found', 404);
    }

    // Check ownership
    if (userRole !== 'admin' && note.user_id !== userId) {
      return error(res, 'You do not have permission to update this note', 403);
    }

    const updatedNote = await Note.update(id, title || note.title, content !== undefined ? content : note.content);

    return success(res, updatedNote, 'Note updated successfully');
  } catch (err) {
    console.error('Update note error:', err);
    return error(res, 'Error updating note', 500);
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const note = await Note.findById(id);

    if (!note) {
      return error(res, 'Note not found', 404);
    }

    // Check ownership
    if (userRole !== 'admin' && note.user_id !== userId) {
      return error(res, 'You do not have permission to delete this note', 403);
    }

    await Note.delete(id);

    return success(res, { id }, 'Note deleted successfully');
  } catch (err) {
    console.error('Delete note error:', err);
    return error(res, 'Error deleting note', 500);
  }
};

// Admin: Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const notes = await Note.getAll(limit, offset);
    const totalResult = await require('../config/database').query('SELECT COUNT(*) FROM notes');
    const total = parseInt(totalResult.rows[0].count, 10);

    return success(res, {
      notes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    }, 'All notes retrieved successfully');
  } catch (err) {
    console.error('Get all notes error:', err);
    return error(res, 'Error retrieving notes', 500);
  }
};
