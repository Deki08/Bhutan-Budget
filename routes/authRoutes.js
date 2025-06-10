const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureGuest, ensureAuthenticated } = require('../middleware/authMiddleware');

// Login routes
router.get('/login', ensureGuest, authController.showLogin);
router.post('/login', authController.login);

// Signup routes
router.get('/signup', ensureGuest, authController.showSignup);
router.post('/signup', authController.signup);

// Email verification route
router.get('/verify-email', authController.verifyEmail);

// Logout route
router.post('/logout', ensureAuthenticated, authController.logout);
router.get('/logout', ensureAuthenticated, authController.logout);

module.exports = router;