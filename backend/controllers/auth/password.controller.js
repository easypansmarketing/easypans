//password-reset only


const User = require('../../models/userModel.js');
const { generateOtp, hashOtp } = require('../../utils/otp.js');
const sendOtpEmail = require('../../utils/sendotpEmail.js');

/* ============================================================
   FORGOT PASSWORD
============================================================ */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    user.otp = hashedOtp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(user.email, otp, "Password Reset");

    res.json({ message: "Password reset OTP sent" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

/* ============================================================
   RESET PASSWORD
============================================================ */

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
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

    user.password = newPassword; // pre-save hook hashes it
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
