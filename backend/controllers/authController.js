/*
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // To make API calls

// Generates a JSON Web Token for a given user ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- UPDATED FUNCTION: Using 'smtp_check' for validation ---
const checkEmailDeliverability = async (email) => {
  try {
    const apiKey = process.env.APILAYER_API_KEY;
    if (!apiKey || apiKey === 'YOUR_APILAYER_KEY_HERE') {
      console.warn('Email validation API key not set or is placeholder. Skipping deliverability check.');
      return { is_valid: true, state: 'skipped' };
    }

    const response = await axios.get(
      `https://api.apilayer.com/email_verification/check?email=${email}`,
      {
        headers: { apikey: apiKey },
        timeout: 5000 // 5-second timeout
      }
    );

    const { data } = response;
    
    console.log('Email Validation Response:', data);

    // --- FIX: Logic is now based on 'smtp_check' ---
    // This field directly confirms if the email exists on the server.
    const isInvalid = data.smtp_check === false;

    return {
      is_valid: !isInvalid,
      message: isInvalid
        ? 'Invalid email ID. This email address does not exist.' 
        : 'Valid email.',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.error('Email validation API timed out.');
        } else {
          console.error('Axios error validating email:', error.response?.data || error.message);
        }
    } else {
      console.error('Email validation API error:', error.message);
    }
    // If the API fails for any reason (timeout, bad key, quota),
    // we will cautiously allow registration to proceed.
    return { is_valid: true, state: 'unknown_api_failure' };
  }
};
// --- END UPDATED FUNCTION ---

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // --- STEP 1: Check if email format is valid (from Mongoose model) ---
    // This is a fast, local check.
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email ID format.' });
    }
    
    // --- STEP 2: Check if user already exists ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // --- STEP 3: Check email deliverability (New API Call) ---
    const emailCheck = await checkEmailDeliverability(email);
    if (!emailCheck.is_valid) {
      return res.status(400).json({ message: emailCheck.message });
    }
    // --- END STEP 3 ---

    // --- STEP 4: Create user (if all checks pass) ---
    const user = await User.create({
      username,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // This will catch any other Mongoose errors (like duplicate username)
    console.error("Error in registerUser:", error); // Added for more debugging
    res.status(400).json({ message: error.message || "An unexpected error occurred." });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
  } catch (error) {
     console.error("Error in loginUser:", error);
     res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { registerUser, loginUser };
*/

const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { generateOtp, hashOtp } = require('../utils/otp.js');
const sendOtpEmail = require('../utils/sendotpEmail.js');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// Generates a JSON Web Token for a given user ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- UPDATED FUNCTION: Using 'smtp_check' for validation ---
const checkEmailDeliverability = async (email) => {
  try {
    const apiKey = process.env.APILAYER_API_KEY;
    if (!apiKey || apiKey === "YOUR_APILAYER_KEY_HERE") {
      console.warn(
        "Email validation API key not set or is placeholder. Skipping deliverability check."
      );
      return { is_valid: true, state: "skipped" };
    }

    const response = await axios.get(
      `https://api.apilayer.com/email_verification/check?email=${email}`,
      {
        headers: { apikey: apiKey },
        timeout: 5000, // 5-second timeout
      }
    );

    const { data } = response;

    console.log("Email Validation Response:", data);

    // --- FIX: Logic is now based on 'smtp_check' ---
    // This field directly confirms if the email exists on the server.
    const isInvalid = data.smtp_check === false;

    return {
      is_valid: !isInvalid,
      message: isInvalid
        ? "Invalid email ID. This email address does not exist."
        : "Valid email.",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        console.error("Email validation API timed out.");
      } else {
        console.error(
          "Axios error validating email:",
          error.response?.data || error.message
        );
      }
    } else {
      console.error("Email validation API error:", error.message);
    }
    // If the API fails for any reason (timeout, bad key, quota),
    // we will cautiously allow registration to proceed.
    return { is_valid: true, state: "unknown_api_failure" };
  }
};
// --- END UPDATED FUNCTION ---

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // --- STEP 1: Check if email format is valid (from Mongoose model) ---
    // This is a fast, local check.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // --- STEP 2: Check if user already exists ---
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // --- STEP 3: Check email deliverability (New API Call) ---
    const emailCheck = await checkEmailDeliverability(email);
    if (!emailCheck.is_valid) {
      return res.status(400).json({ message: emailCheck.message });
    }
    // --- END STEP 3 ---

    // --- STEP 4: Create user (if all checks pass) ---
    const user = await User.create({
      username,
      email,
      password,
      phone,
    });

    if (user) {
      const otp = generateOtp();
       const hashedOtp = hashOtp(otp);
      // Save OTP in user
      user.otp = hashedOtp;
      user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
      user.isVerified = false;

      await user.save();

      // Send OTP email
      await sendOtpEmail(user.email, otp);

      res.status(201).json({
        message: "OTP sent to your email. Please verify to continue.",
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // This will catch any other Mongoose errors (like duplicate username)
    console.error("Error in registerUser:", error); // Added for more debugging
    res
      .status(400)
      .json({ message: error.message || "An unexpected error occurred." });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // 1️⃣ Check email & password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Check email verification
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }

    // 3️⃣ Login success
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};



const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const hashedOtp = hashOtp(otp);

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.json({
      message: 'Email verified successfully',
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};


// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendOtpEmail(user.email, otp, "Password Reset");

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        username: name,
        email,
        password: 'google_oauth_' + googleId, // Placeholder password
        phone: '0000000000', // Placeholder phone
        isVerified: true, // Google accounts are pre-verified
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
};

module.exports = { registerUser, loginUser, verifyOtp, forgotPassword, googleAuth };

