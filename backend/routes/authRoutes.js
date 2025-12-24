const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp } = require('../controllers/authController.js');

// Route for user registration
router.post('/register', registerUser);

router.post('/verify-otp', verifyOtp);

// Route for user login
router.post('/login', loginUser);



module.exports = router;
