const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
  // Create a new user
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, role, created_at',
      [email, hashedPassword]
    );
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await db.query(
      'SELECT id, email, password, role, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await db.query(
      'SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin only)
  static async getAll(limit = 10, offset = 0) {
    const result = await db.query(
      'SELECT id, email, role, created_at, updated_at FROM users LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}

module.exports = User;
