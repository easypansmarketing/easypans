const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp, type = "Registration") => {
  console.log(process.env.MAIL_USER, process.env.MAIL_PASS);

  const subject = type === "Password Reset" 
    ? "Your Easypans Password Reset OTP" 
    : "Your Easypans Registration OTP";
    
  const message = type === "Password Reset"
    ? `Your OTP for Easypans Password Reset is: <strong>${otp}</strong>`
    : `Your OTP for Easypans Registration is: <strong>${otp}</strong>`;

  await transporter.sendMail({
    from: `"OTP Mailer" <${process.env.MAIL_USER}>`,
    to: email,
    subject,
    html: `
      <p>${message}</p>
      <p>This OTP is valid for the next 10 minutes and can be used only once. Please do not share it with anyone.</p>
      <p>If you need assistance, contact us at support@easypans.com</p>
      <p>Warm regards,<br>Team Easypans</p>
    `,
  });
};

module.exports = sendOtpEmail;
