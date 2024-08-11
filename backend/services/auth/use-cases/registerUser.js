const User = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { toModel } = require("../mapper/User_Register_Mapper");
const parseExpiration = require("../../utils/parseExpiration");
const sendVerificationMail = require("../../utils/sendVerificationMail");

dotenv.config();

const registerUser = async (dto) => {
  let user = await User.findOne({ email: dto.email });

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

  // Convert DTO to Mongoose model
  user = new User(
    toModel({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      isVerified: dto.isVerified || false,
    })
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(dto.password, salt);

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
