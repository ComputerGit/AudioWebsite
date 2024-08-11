const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendVerificationMail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify your email",
    text: `Please verify your email by clicking the following link: ${process.env.CLIENT_URL}/verify-email?token=${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending mail:", err);
      return false;
    }
    console.info("Mail sent:", info);
    return true;
  });
};

module.exports = sendVerificationMail;
