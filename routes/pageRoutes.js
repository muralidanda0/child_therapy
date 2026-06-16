const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

router.get('/', pageController.getHome);
router.get('/services', pageController.getServices);
router.get('/about', pageController.getAbout);
router.get('/contact', pageController.getContact);

// Convenience aliases — all internal redirects use /login and /register
router.get('/login', redirectIfAuthenticated, authController.getLogin);
router.get('/register', redirectIfAuthenticated, authController.getRegister);
router.post('/login', redirectIfAuthenticated, authController.postLogin);
router.post('/register', redirectIfAuthenticated, authController.postRegister);

module.exports = router;
