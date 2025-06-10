const db = require('../config/db'); // Adjust the path as needed

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      verification_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log('✅ Users table created.');
  } catch (error) {
    console.error('❌ Error creating users table:', error);
  } finally {
    db.end(); // close connection
  }
};

createUsersTable();
