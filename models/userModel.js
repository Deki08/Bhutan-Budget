const db = require('../config/db');

// ✅ Create users table if not exists
async function createUsersTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created or already exists');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  }
}

// ✅ Find a user by email
async function findByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// ✅ Find a user by ID (for session deserialization)
async function findById(id) {
  const result = await db.query('SELECT id, email, is_verified FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// ✅ Create user with hashed password and verification token
async function createUserWithVerification(email, hashedPassword, token) {
  await db.query(
    'INSERT INTO users (email, password, verification_token) VALUES ($1, $2, $3)',
    [email, hashedPassword, token]
  );
}

// ✅ Verify user by email (sets is_verified and clears token)
async function verifyUserByEmail(email) {
  const result = await db.query(
    `UPDATE users
     SET is_verified = true, verification_token = NULL
     WHERE email = $1 AND is_verified = false
     RETURNING *`,
    [email]
  );
  return result.rows[0];
}

module.exports = {
  createUsersTable,
  findByEmail,
  findById, // 🔥 Added this for Passport
  createUserWithVerification,
  verifyUserByEmail,
};
