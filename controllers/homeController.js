const transactionModel = require('../models/transactionModel');
const transactionModel = require('../models/userModel');
module.exports = {
  // Show home page
  showHome: async (req, res) => {
    try {
      let transactions = [];
      let balance = 0;
      let monthlyIncome = 0;
      let monthlyExpenses = 0;
      
      if (req.isAuthenticated()) {
        transactions = await transactionModel.getUserTransactions(req.user.id);
        // Calculate financial summary
        transactions.forEach(t => {
          const amount = parseFloat(t.amount);
          if (t.type === 'income') {
            monthlyIncome += amount;
          } else {
            monthlyExpenses += amount;
          }
        });
        balance = monthlyIncome - monthlyExpenses;
      }

      res.render('index', {
        title: 'Home',
        user: req.user || null,
        isAuthenticated: req.isAuthenticated(),
        balance,
        monthlyIncome,
        monthlyExpenses,
        transactions: transactions.slice(0, 5)
      });
    } catch (err) {
      console.error(err);
      res.render('index', {
        title: 'Home',
        error: 'Failed to load transactions',
        user: req.user || null,
        isAuthenticated: req.isAuthenticated(),
        balance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        transactions: []
      });
    }
  },

  // Show about page
  showAbout: (req, res) => {
    res.render('about', {
      title: 'About',
      isAuthenticated: req.isAuthenticated()
    });
  },

  // Show contact page
  showContact: (req, res) => {
    res.render('contact', {
      title: 'Contact',
      isAuthenticated: req.isAuthenticated()
    });
  },

  // Handle contact form
  handleContact: (req, res) => {
    console.log('Contact form submitted:', req.body);
    req.flash('success', 'Your message has been sent!');
    res.redirect('/contact');
  }
};