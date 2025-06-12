const db = require('../config/db');

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT false,
      verification_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(query);
    console.log('✅ Users table created.');
  } catch (error) {
    console.error('❌ Error creating User table:', error);
  }
};

createUsersTable();

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await db.query('SELECT id, email, is_verified FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function createUserWithVerification(email, hashedPassword, token) {
  await db.query(
    'INSERT INTO users (email, password, verification_token) VALUES ($1, $2, $3)',
    [email, hashedPassword, token]
  );
}

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
  findById,
  createUserWithVerification,
  verifyUserByEmail,
};
