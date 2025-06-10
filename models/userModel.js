const db = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
  // Create new user (regular)
  createUser: async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password) 
       VALUES ($1, $2) 
       RETURNING id, email, created_at`,
      [email, hashedPassword]
    );
    return result.rows[0];
  },

  // Create new user with email verification token
  createUserWithVerification: async (email, hashedPassword, verificationToken) => {
    const result = await db.query(
      `INSERT INTO users (email, password, is_verified, verification_token)
       VALUES ($1, $2, FALSE, $3)
       RETURNING id, email, created_at`,
      [email, hashedPassword, verificationToken]
    );
    return result.rows[0];
  },

  // Verify user by email (set is_verified true and remove token)
  verifyUserByEmail: async (email) => {
    const result = await db.query(
      `UPDATE users
       SET is_verified = TRUE, verification_token = NULL
       WHERE email = $1
       RETURNING id, email, is_verified`,
      [email]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const result = await db.query(
      `SELECT id, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Compare password
  comparePassword: async (candidatePassword, hashedPassword) => {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};
