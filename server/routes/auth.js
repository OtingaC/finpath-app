const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST Register new user
router.post('/register', register);

// POST Login user
router.post('/login', login);

// GET current user info
router.get('/me', protect, getMe);

module.exports = router;