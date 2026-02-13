const express = require('express');
const router = express.Router();

// Registration + Login + Email Verification
const { registerUser, loginUser, verifyOtp } = require('../controllers/auth/auth.controller.js');

// Password reset
const { forgotPassword, resetPassword } = require('../controllers/auth/password.controller.js');

// Google OAuth
const { googleAuth } = require('../controllers/auth/google.controller.js');

// Route for user registration
router.post('/register', registerUser);

// Verify Email OTP
router.post('/verify-otp', verifyOtp);

// Login
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

// 🔥 THIS WAS MISSING
router.post('/reset-password', resetPassword);

// Google OAuth
router.post('/google', googleAuth);

module.exports = router;
