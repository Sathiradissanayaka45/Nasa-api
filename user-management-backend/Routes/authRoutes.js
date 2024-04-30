const express = require('express');
const UserController = require('../Controllers/UserController');

const router = express.Router();

// Registration Route
router.post('/register', UserController.register);
// Login Route
router.post('/login', UserController.login);
// Forgot Password Route
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', UserController.resetPassword);

module.exports = router;


