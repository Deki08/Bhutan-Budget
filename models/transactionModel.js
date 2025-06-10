const db = require('../config/db'); // Adjust the path as needed

const createTransactionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
      description VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'completed',
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(query);
    console.log('✅ Transactions table created.');
  } catch (error) {
    console.error('❌ Error creating transactions table:', error);
  } finally {
    db.end(); // close connection
  }
};

createTransactionsTable();
