const userModel = require('../models/userModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  // Show login form
  showLogin: (req, res) => {
    res.render('auth/login', {
      message: req.flash('error'),
      success_msg: req.flash('success_msg'),
      authPage: true,
      title: 'Login',
      isAuthenticated: false
    });
  },

  // Handle login (with verification check)
  login: async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/auth/login');
      }

      if (!user.is_verified) {
        req.flash('error', 'Please verify your email before logging in.');
        return res.redirect('/auth/login');
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('overview');
      });
    })(req, res, next);
  },

  // Show signup form
  showSignup: (req, res) => {
    res.render('auth/signup', {
      message: req.flash('error'),
      authPage: true,
      title: 'Sign Up',
      isAuthenticated: false
    });
  },

  // Handle signup with email verification
  signup: async (req, res) => {
    try {
      const { email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/auth/signup');
      }

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        req.flash('error', 'Email already in use');
        return res.redirect('/auth/signup');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      await userModel.createUserWithVerification(email, hashedPassword, verificationToken);

      const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        from: `"Auth Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your email',
        html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
      });

      req.flash('success_msg', 'Signup successful! Check your email to verify your account.');
      res.redirect('/auth/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Registration failed');
      res.redirect('/auth/signup');
    }
  },

  // Email verification handler
  verifyEmail: async (req, res) => {
    const { token } = req.query;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
      const user = await userModel.verifyUserByEmail(email);

      if (user) {
        req.flash('success_msg', 'Email successfully verified! You can now log in.');
      } else {
        req.flash('error', 'Could not verify email. The user may already be verified or does not exist.');
      }
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Verification error:', error.message);
      req.flash('error', 'Invalid or expired verification link. Please try signing up again.');
      res.redirect('/auth/login');
    }
  },

  // Handle logout
  logout: (req, res) => {
    req.logout(function(err) {
      if (err) {
        console.error(err);
        return next(err);
      }
      req.flash('success_msg', 'You have been logged out');
      res.redirect('/');
    });
  }
};
