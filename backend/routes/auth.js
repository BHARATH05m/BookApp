const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

// debug: list available controller exports
console.log('DEBUG authController keys:', Object.keys(authController || {}));

// helper: ensure handler is a function
function ensureHandler(fn, name) {
  if (typeof fn === 'function') return fn;
  return (req, res) => {
    console.error(`Missing route handler: ${name}`);
    res.status(500).json({ error: `Server misconfigured: ${name} missing` });
  };
}

// Register new user
router.post('/register', ensureHandler(authController.register, 'authController.register'));

// Login user
router.post('/login', ensureHandler(authController.login, 'authController.login'));

// Get user profile
router.get('/profile', authenticateToken, ensureHandler(authController.profile, 'authController.profile'));

// Update user profile
router.put('/profile', authenticateToken, ensureHandler(authController.updateProfile, 'authController.updateProfile'));

// Change password
router.put('/change-password', authenticateToken, ensureHandler(authController.changePassword, 'authController.changePassword'));

// Get all users (Admin only)
router.get('/users', authenticateToken, ensureHandler(authController.getAllUsers, 'authController.getAllUsers'));

module.exports = router;
