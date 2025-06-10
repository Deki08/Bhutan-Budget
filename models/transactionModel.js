const db = require('../config/db');

module.exports = {
  // CREATE
  createTransaction: async (userId, transactionData) => {
    const { type, description, category, amount, status, date } = transactionData;
    const result = await db.query(
      `INSERT INTO transactions (user_id, type, description, category, amount, status, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, type, description, category, amount, status || 'completed', date || new Date()]
    );
    return result.rows[0];
  },

  // READ (All transactions for user)
  getUserTransactions: async (userId) => {
    const result = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },

  // READ (Single transaction by ID)
  getTransactionById: async (transactionId) => {
    const result = await db.query(
      `SELECT * FROM transactions WHERE id = $1`,
      [transactionId]
    );
    return result.rows[0];
  },

  // UPDATE
  updateTransaction: async (transactionId, updateData) => {
    const { description, category, amount, status, date } = updateData;
    const result = await db.query(
      `UPDATE transactions
       SET description = $1, category = $2, amount = $3, status = $4, date = $5
       WHERE id = $6 RETURNING *`,
      [description, category, amount, status, date, transactionId]
    );
    return result.rows[0];
  },

  // DELETE
  deleteTransaction: async (transactionId) => {
    await db.query(
      `DELETE FROM transactions WHERE id = $1`,
      [transactionId]
    );
  },

  // Get income transactions
  getIncomeTransactions: async (userId) => {
    const result = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1 AND type = 'income' ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },

  // Get expense transactions
  getExpenseTransactions: async (userId) => {
    const result = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1 AND type = 'expense' ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },

  // Get overview data
  getOverview: async (userId) => {
    const incomeResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'income'`,
      [userId]
    );
    
    const expenseResult = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense'`,
      [userId]
    );
    
    const recentTransactions = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 5`,
      [userId]
    );

    return {
      income: parseFloat(incomeResult.rows[0].total) || 0,
      expenses: parseFloat(expenseResult.rows[0].total) || 0,
      balance: parseFloat(incomeResult.rows[0].total) - parseFloat(expenseResult.rows[0].total),
      transactions: recentTransactions.rows
    };
  }
};