const db = require('../config/database');

class Note {
  // Create a new note
  static async create(userId, title, content = '') {
    const result = await db.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at, updated_at',
      [userId, title, content]
    );
    return result.rows[0];
  }

  // Get note by ID
  static async findById(id) {
    const result = await db.query(
      'SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Get all notes of a user
  static async findByUserId(userId, limit = 10, offset = 0) {
    const result = await db.query(
      'SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  }

  // Get all notes (admin access)
  static async getAll(limit = 10, offset = 0) {
    const result = await db.query(
      'SELECT id, user_id, title, content, created_at, updated_at FROM notes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  // Search notes by title
  static async searchByTitle(userId, searchTerm, limit = 10, offset = 0) {
    const result = await db.query(
      'SELECT id, user_id, title, content, created_at, updated_at FROM notes WHERE user_id = $1 AND title ILIKE $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
      [userId, `%${searchTerm}%`, limit, offset]
    );
    return result.rows;
  }

  // Update a note
  static async update(id, title, content) {
    const result = await db.query(
      'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, user_id, title, content, created_at, updated_at',
      [title, content, id]
    );
    return result.rows[0];
  }

  // Delete a note
  static async delete(id) {
    const result = await db.query(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Count notes for a user
  static async countByUserId(userId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM notes WHERE user_id = $1',
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = Note;
