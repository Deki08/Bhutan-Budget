const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home page
router.get('/', homeController.showHome);

// About page
router.get('/about', homeController.showAbout);

// Contact page
router.get('/contact', homeController.showContact);
router.post('/contact', homeController.handleContact);

module.exports = router;