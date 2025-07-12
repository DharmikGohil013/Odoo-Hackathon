const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 🔐 Register (user or admin — admin needs manual role assignment)
router.post('/register', authController.register);

// 🔑 Login
router.post('/login', authController.login);

// 🙋‍♂️ Get current logged-in user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
