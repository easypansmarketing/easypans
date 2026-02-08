const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp, forgotPassword, googleAuth } = require('../controllers/authController.js');

// Route for user registration
router.post('/register', registerUser);

router.post('/verify-otp', verifyOtp);

// Route for user login
router.post('/login', loginUser);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for Google OAuth
router.post('/google', googleAuth);

module.exports = router;
