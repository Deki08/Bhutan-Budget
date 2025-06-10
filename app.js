
const pgSession = require('connect-pg-simple')(session);
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

// Initialize app
const app = express();

// Database connection
require('./config/db');

// Passport configuration
const initializePassport = require('./config/passport');
initializePassport(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.title = 'Bhutan Budget'; // Default title
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/homeRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        isAuthenticated: req.isAuthenticated()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', {
        title: 'Server Error',
        isAuthenticated: req.isAuthenticated()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});