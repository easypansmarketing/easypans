const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // --- ADDED: To make API calls ---

// Generates a JSON Web Token for a given user ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- UPDATED FUNCTION: To use Apilayer Email Verification ---
const checkEmailDeliverability = async (email) => {
  try {
    const apiKey = process.env.APILAYER_API_KEY; // --- CHANGED: Using new key ---
    if (!apiKey || apiKey === 'YOUR_APILAYER_KEY_HERE') {
      console.warn('Email validation API key not set. Skipping deliverability check.');
      // If no key, just assume it's valid to not block development.
      return { is_valid: true, state: 'deliverable' };
    }

    const response = await axios.get(
      `https://api.apilayer.com/email_verification/check?email=${email}`,
      { headers: { apikey: apiKey } } // --- CHANGED: Updated endpoint and headers ---
    );

    const { data } = response;
    
    // --- ADDED: This log will show up in your Render backend logs ---
    console.log('Email Validation Response:', data);

    // --- FIX: This logic is now more forgiving ---
    // We check if the email server is valid AND if it's deliverable.
    // This allows for "risky" but valid emails.
    const isDeliverable = data.deliverable === true && data.is_smtp_valid === true;

    return {
      is_valid: isDeliverable,
      message: !isDeliverable
        ? 'Invalid email ID. Please check for typos or use a different email.' 
        : 'Valid email.',
    };
  } catch (error) {
    console.error('Email validation API error:', error.message);
    // If the API fails, we'll cautiously allow registration to not block users.
    return { is_valid: true, state: 'unknown' };
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
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
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
};

module.exports = { registerUser, loginUser };