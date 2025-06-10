const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Dashboard Overview
router.get('/overview', ensureAuthenticated, transactionController.showOverview);

// All Transactions
router.get('/list', ensureAuthenticated, transactionController.listTransactions);

// Income Transactions
router.get('/income', ensureAuthenticated, transactionController.showIncome);
router.post('/income', ensureAuthenticated, transactionController.createIncome);

// Expense Transactions
router.get('/expense', ensureAuthenticated, transactionController.showExpense);
router.post('/expense', ensureAuthenticated, transactionController.createExpense);

// Create Transaction
router.get('/create', ensureAuthenticated, transactionController.showCreateForm);
router.post('/create', ensureAuthenticated, transactionController.createTransaction);

// Edit & Update Transaction
router.get('/edit/:id', ensureAuthenticated, transactionController.showEditForm);
router.post('/update/:id', ensureAuthenticated, transactionController.updateTransaction);

// Delete Transaction
router.post('/delete/:id', ensureAuthenticated, transactionController.deleteTransaction);

module.exports = router;
