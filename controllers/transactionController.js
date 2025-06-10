const transactionModel = require('../models/transactionModel');

// Show overview dashboard
exports.showOverview = async (req, res) => {
  try {
    const summary = await transactionModel.getOverview(req.user.id);
    res.render('transaction', { 
      title: 'Overview',
      isAuthenticated: true,
      viewType: 'overview',
      data: summary
    });
  } catch (err) {
    console.error('Error in showOverview:', err);
    req.flash('error', 'Failed to load overview. Please try again.');
    res.redirect('/transactions/list');
  }
};

// List all transactions
exports.listTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.getUserTransactions(req.user.id);
    res.render('transaction', { 
      title: 'All Transactions',
      isAuthenticated: true,
      viewType: 'list',
      data: transactions
    });
  } catch (err) {
    console.error('Error in listTransactions:', err);
    req.flash('error', 'Failed to load transactions. Please try again.');
    res.redirect('/');
  }
};

// Show income transactions
exports.showIncome = async (req, res) => {
  try {
    const income = await transactionModel.getIncomeTransactions(req.user.id);
    res.render('transaction', { 
      title: 'Income',
      isAuthenticated: true,
      viewType: 'income',
      data: income
    });
  } catch (err) {
    console.error('Error in showIncome:', err);
    req.flash('error', 'Failed to load income transactions. Please try again.');
    res.redirect('/transactions/list');
  }
};

// Show expense transactions
exports.showExpense = async (req, res) => {
  try {
    const expenses = await transactionModel.getExpenseTransactions(req.user.id);
    res.render('transaction', { 
      title: 'Expenses',
      isAuthenticated: true,
      viewType: 'expense',
      data: expenses
    });
  } catch (err) {
    console.error('Error in showExpense:', err);
    req.flash('error', 'Failed to load expense transactions. Please try again.');
    res.redirect('/transactions/list');
  }
};

// Show create form
exports.showCreateForm = async (req, res) => {
  try {
    res.render('transaction', {
      title: 'Add Transaction',
      isAuthenticated: true,
      viewType: 'create',
      data: null
    });
  } catch (err) {
    console.error('Error in showCreateForm:', err);
    req.flash('error', 'Failed to load create form. Please try again.');
    res.redirect('/transactions/list');
  }
};

// Create general transaction
exports.createTransaction = async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      throw new Error('Invalid amount provided');
    }
    await transactionModel.createTransaction(req.user.id, req.body);
    req.flash('success', 'Transaction created successfully');
    res.redirect('/transactions/list');
  } catch (err) {
    console.error('Error in createTransaction:', err);
    req.flash('error', 'Failed to create transaction. Please try again.');
    res.redirect('/transactions/create');
  }
};

// Create income transaction
exports.createIncome = async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      throw new Error('Invalid amount provided');
    }
    await transactionModel.createTransaction(req.user.id, {
      ...req.body,
      type: 'income',
      source: req.body.description
    });
    req.flash('success', 'Income transaction created successfully');
    res.redirect('/transactions/income');
  } catch (err) {
    console.error('Error in createIncome:', err);
    req.flash('error', 'Failed to create income transaction. Please try again.');
    res.redirect('/transactions/income');
  }
};

// Create expense transaction
exports.createExpense = async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      throw new Error('Invalid amount provided');
    }
    await transactionModel.createTransaction(req.user.id, {
      ...req.body,
      type: 'expense'
    });
    req.flash('success', 'Expense transaction created successfully');
    res.redirect('/transactions/expense');
  } catch (err) {
    console.error('Error in createExpense:', err);
    req.flash('error', 'Failed to create expense transaction. Please try again.');
    res.redirect('/transactions/expense');
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const transaction = await transactionModel.getTransactionById(req.params.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    res.render('transaction', { 
      title: 'Edit Transaction',
      isAuthenticated: true,
      viewType: 'edit',
      data: transaction
    });
  } catch (err) {
    console.error('Error in showEditForm:', err);
    req.flash('error', 'Failed to load transaction for editing. Please try again.');
    res.redirect('/transactions/list');
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      throw new Error('Invalid amount provided');
    }
    const updated = await transactionModel.updateTransaction(req.params.id, req.body);
    if (!updated) {
      throw new Error('Transaction not found');
    }
    req.flash('success', 'Transaction updated successfully');
    res.redirect('/transactions/list');
  } catch (err) {
    console.error('Error in updateTransaction:', err);
    req.flash('error', 'Failed to update transaction. Please try again.');
    res.redirect(`/transactions/edit/${req.params.id}`);
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionModel.deleteTransaction(req.params.id);
    req.flash('success', 'Transaction deleted successfully');
    res.redirect('/transactions/list');
  } catch (err) {
    console.error('Error in deleteTransaction:', err);
    req.flash('error', 'Failed to delete transaction. Please try again.');
    res.redirect('/transactions/list');
  }
};
