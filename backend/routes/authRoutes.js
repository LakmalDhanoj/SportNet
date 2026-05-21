const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', authController.registerPlayer);
router.post('/login', authController.login);
router.post('/forgot-key', authController.forgotKey);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
