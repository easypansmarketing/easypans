//(Registration + Login + Email Verification)


const User = require('../../models/userModel.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { generateOtp, hashOtp } = require('../../utils/otp.js');
const sendOtpEmail = require('../../utils/sendotpEmail.js');

/* ============================================================
   TOKEN GENERATION
============================================================ */

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* ============================================================
   EMAIL DELIVERABILITY CHECK (APILAYER)
============================================================ */

const checkEmailDeliverability = async (email) => {
  try {
    const apiKey = process.env.APILAYER_API_KEY;

    if (!apiKey || apiKey === "YOUR_APILAYER_KEY_HERE") {
      console.warn("Email validation API key missing. Skipping deliverability check.");
      return { is_valid: true, state: "skipped" };
    }

    const response = await axios.get(
      `https://api.apilayer.com/email_verification/check?email=${email}`,
      {
        headers: { apikey: apiKey },
        timeout: 5000,
      }
    );

    const { data } = response;

    const isInvalid = data.smtp_check === false;

    return {
      is_valid: !isInvalid,
      message: isInvalid
        ? "Invalid email ID. This email address does not exist."
        : "Valid email.",
    };

  } catch (error) {
    console.error("Email validation failed:", error.message);
    return { is_valid: true, state: "api_failed_allowing_signup" };
  }
};

/* ============================================================
   REGISTER USER
============================================================ */

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const emailCheck = await checkEmailDeliverability(email);
    if (!emailCheck.is_valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const user = await User.create({
      username,
      email,
      password,
      phone,
      isVerified: false,
    });

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      email: user.email,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ============================================================
   VERIFY EMAIL OTP
============================================================ */

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const hashedOtp = hashOtp(otp);

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ============================================================
   LOGIN USER
============================================================ */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
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
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
};
