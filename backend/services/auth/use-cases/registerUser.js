const User = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// const parseExpiration = require("../utils/parseExpiration");
const parseExpiration = require("../../utils/parseExpiration");
const sendVerificationMail = require("../../utils/sendVerificationMail");

const registerUser = async ({ name, email, password }) => {
  let user = await User.findOne({ email });

  // Check whether user already exists
  if (user) {
    // Check whether user already verified
    if (user.isVerified) {
      throw new Error("User Already Exists");
    }

    // Check if there's an existing verification token and if it is valid
    if (user.verificationToken && user.verificationTokenExpires > Date.now()) {
      return {
        msg: "Verification is already sent. Check your email.",
        token: user.verificationToken,
      };
    }

    const expirationInMilliSeconds = parseExpiration(
      process.env.VERIFICATION_TOKEN_EXPIRATION
    );

    const verificationToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: expirationInMilliSeconds / 1000, // JWT expects seconds
      }
    );

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + expirationInMilliSeconds;
    await user.save();

    sendVerificationMail(user.email, verificationToken);

    return { msg: `Verification Email Sent`, token: verificationToken };
  }

  // Create a new user and generate a new verification token
  user = new User({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  const expirationInMilliSeconds = parseExpiration(
    process.env.VERIFICATION_TOKEN_EXPIRATION
  );

  // Generate email verification token
  const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: expirationInMilliSeconds / 1000, // JWT expects seconds
  });
  const expirationTime = jwt.decode(verificationToken).exp * 1000;

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = expirationTime;
  await user.save();

  sendVerificationMail(user.email, verificationToken);

  return {
    msg: "User Registered. Verification Email Sent",
    token: verificationToken,
  };
};

module.exports = registerUser;
