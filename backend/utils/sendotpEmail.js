import nodemailer from "nodemailer";

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
    from: `"EasyPans" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your EasyPans account",
    html: `
      <h2>Your OTP: ${otp}</h2>
      <p>Valid for 5 minutes.</p>
    `,
  });
};

export default sendOtpEmail;
