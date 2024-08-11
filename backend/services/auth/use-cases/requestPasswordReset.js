const User = require("../models/authModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const requestPasswordReset = async (email) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Not Registered / Not Found");
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  const expirationTime = process.env.PASSWORD_RESET_EXPIRATION || 3600000;
  user.resetPasswordExpires = Date.now() + parseInt(expirationTime);

  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const expirationDuration = parseInt(expirationTime) / (60 * 60 * 1000);

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset",
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. 
    Please click on the following link, 
    or paste it into your browser to complete the process within ${expirationDuration} hour(s) of 
    receiving it: ${process.env.CLIENT_URL}/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions);

  return { msg: "Password Email Sent", token };
};

module.exports = requestPasswordReset;
