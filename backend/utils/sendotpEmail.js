const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  console.log(process.env.MAIL_USER, process.env.MAIL_PASS);

  await transporter.sendMail({
    from: `"OTP Mailer" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Easypans Registration OTP",
    html: `
      <p>Your OTP for Easypans Registration is: <strong>${otp}</strong></p>
      <p>This OTP is valid for the next 10 minutes and can be used only once. Please do not share it with anyone.</p>
      <p>Warm regards,<br>Team Easypans</p>
    `,
  });
};

module.exports = sendOtpEmail;
