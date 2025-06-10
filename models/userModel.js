const db = require('../config/db');

async function createUsersTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  }
}

module.exports = {
  createUsersTable,
  // ... other user model methods
};
